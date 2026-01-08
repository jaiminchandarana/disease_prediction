from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from connection import connection
from generate import generate_code
from llmmodel import predict_disease_from_qa
import hashlib
import psycopg2
import os
import sys
from weasyprint import HTML
from io import BytesIO

# Add GTK3 to PATH
gtk3_path = r'C:\Program Files\GTK3-Runtime Win64\bin'
if os.path.exists(gtk3_path):
    os.environ['PATH'] = gtk3_path + os.pathsep + os.environ.get('PATH', '')
    if hasattr(os, 'add_dll_directory'):
        try:
            os.add_dll_directory(gtk3_path)
        except Exception:
            pass


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://ayurix.vercel.app","http://localhost:5173", "http://localhost:3000"]}})

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/api/auth/register', methods=['GET'])
def register():
    try:
        # Get parameters from query string
        full_name = request.args.get('name')
        email = request.args.get('email')
        password = request.args.get('password')
        address = request.args.get('address')
        phone = request.args.get('phone')
        role = request.args.get('role')
        
        # Validate required fields
        if not all([full_name, email, password, address, phone, role]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Generate ID
        user_id = generate_code()
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Connect to database
        conn = connection()
        cur = conn.cursor()
        
        # Check if email already exists
        cur.execute("SELECT email FROM role WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Email already exists'
            }), 400
        
        # Insert new user
        try:
            cur.execute(
                "INSERT INTO role (id, full_name, email, phone, password, role, address) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (str(user_id), full_name, email, phone, hashed_password, role, address)
            )
        except psycopg2.errors.UniqueViolation:
            # If ID already exists, generate a new one
            user_id = generate_code()
            cur.execute(
                "INSERT INTO role (id, full_name, email, phone, password, role, address) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                (str(user_id), full_name, email, phone, hashed_password, role, address)
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        # Send credentials email
        try:
            from mail import send_credential
            send_credential(email, password)
        except Exception:
            pass

        return jsonify({
            'success': True,
            'message': 'Registration successful'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/login', methods=['GET'])
def login():
    try:
        # Get parameters from query string
        identifier = request.args.get('identifier')
        password = request.args.get('password')
        role = request.args.get('role')
        
        # Validate required fields
        if not all([identifier, password, role]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Connect to database
        conn = connection()
        cur = conn.cursor()
        
        # Check if user exists with email/ID and password
        cur.execute(
            "SELECT * FROM role WHERE (email = %s OR id = %s) AND password = %s AND role = %s",
            (identifier, identifier, hashed_password, role)
        )
        
        user = cur.fetchone()
        
        if user:
            user_data = {
                'id': user[0],
                'name': user[1],
                'full_name': user[1],
                'email': user[2],
                'phone': user[3],
                'role': user[5],
                'address': user[6]
            }
            
            cur.close()
            conn.close()
            
            return jsonify({
                'success': True,
                'user': user_data,
                'token': user[0]  # Using ID as simple token
            }), 200
        else:
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Invalid credentials or role'
            }), 401
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    try:
        token = request.args.get('token')
        
        if not token:
            return jsonify({
                'success': False,
                'error': 'Token required'
            }), 401
        
        conn = connection()
        cur = conn.cursor()
        
        # Get user by ID
        cur.execute("SELECT * FROM role WHERE id = %s", (token,))
        user = cur.fetchone()
        
        if user:
            user_data = {
                'id': user[0],
                'name': user[1],
                'full_name': user[1],
                'email': user[2],
                'phone': user[3],
                'role': user[5],
                'address': user[6]
            }
            
            cur.close()
            conn.close()
            
            return jsonify({
                'success': True,
                'user': user_data
            }), 200
        else:
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/register-doctor', methods=['GET'])
def register_doctor():
    try:
        # Get parameters from query string
        admin_token = request.args.get('admin_token')
        full_name = request.args.get('name')
        email = request.args.get('email')
        password = request.args.get('password')
        address = request.args.get('address')
        phone = request.args.get('phone')
        department = request.args.get('department', '')[:15]
        specialization = request.args.get('specialization', '')[:15]
        qualification = request.args.get('qualification', '')[:15]
        experience = request.args.get('experience', '')[:15]
        licence_no = request.args.get('licence_no', '')
        consultation_fee = request.args.get('consultation_fee', '')
        status = request.args.get('status', 'active')
        
        # Validate required fields
        if not all([admin_token, full_name, email, password, address, phone]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Verify admin token
        conn = connection()
        cur = conn.cursor()
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        admin = cur.fetchone()
        
        if not admin or admin[0] != 'admin':
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Unauthorized. Only admins can register doctors.'
            }), 403
        
        # Check if email already exists
        cur.execute("SELECT email FROM role WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Email already exists'
            }), 400
        
        # Generate ID
        user_id = generate_code()
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Insert new doctor
        try:
            cur.execute(
                "INSERT INTO role (id, full_name, email, phone, password, role, address, department, specialization, qualification, experience, licence_no, consulation_fee, status, admin_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (str(user_id), full_name, email, phone, hashed_password, 'doctor', address, department, specialization, qualification, experience, licence_no, consultation_fee, status, admin_token)
            )
        except psycopg2.errors.UniqueViolation:
            # If ID already exists, generate a new one
            user_id = generate_code()
            cur.execute(
                "INSERT INTO role (id, full_name, email, phone, password, role, address, department, specialization, qualification, experience, licence_no, consulation_fee, status, admin_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (str(user_id), full_name, email, phone, hashed_password, 'doctor', address, department, specialization, qualification, experience, licence_no, consultation_fee, status, admin_token)
            )
        
        conn.commit()
        cur.close()
        conn.close()
        
        # Send credentials email
        try:
            from mail import send_credential
            send_credential(email, password)
        except Exception:
            pass

        return jsonify({
            'success': True,
            'message': 'Doctor registration successful',
            'doctor_id': str(user_id)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/get-all-doctors', methods=['GET'])
def get_all_doctors():
    try:
        admin_token = request.args.get('admin_token')
        
        if not admin_token:
            return jsonify({
                'success': False,
                'error': 'Missing admin token'
            }), 400
        
        # Verify admin token
        conn = connection()
        cur = conn.cursor()
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        admin = cur.fetchone()
        
        if not admin or admin[0] != 'admin':
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Unauthorized. Only admins can access this.'
            }), 403
        
        # Get all doctors for this admin
        cur.execute("""
            SELECT id, full_name, email, phone, address, department, specialization, 
                   qualification, experience, licence_no, consulation_fee, status 
            FROM role WHERE role = 'doctor' AND admin_id = %s
        """, (admin_token,))
        
        doctors = cur.fetchall()
        
        doctor_list = []
        for doc in doctors:
            doctor_list.append({
                'id': doc[0],
                'name': doc[1],
                'full_name': doc[1],
                'email': doc[2],
                'phone': doc[3],
                'address': doc[4],
                'department': doc[5] or '',
                'specialization': doc[6] or '',
                'qualification': doc[7] or '',
                'experience': doc[8] or '',
                'licence_no': doc[9] or '',
                'consultation_fee': doc[10] or '',
                'status': doc[11] or 'active'
            })
        
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'doctors': doctor_list
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predict', methods=['GET'])
def predict():
    try:
        # Get Q&A data from query string
        qna_data = {}
        
        # Try to get as JSON
        qna_json = request.args.get('qna')
        if qna_json:
            import json
            try:
                qna_data = json.loads(qna_json)
            except:
                pass
        
        # If not JSON, get individual fields
        if not qna_data:
            for key in request.args.keys():
                if key != 'qna':
                    qna_data[key] = request.args.get(key)
        
        if not qna_data:
            return jsonify({
                'success': False,
                'error': 'No Q&A data provided'
            }), 400
        
        # Call the LLM model
        result = predict_disease_from_qa(qna_data)
        
        return jsonify({
            'success': True,
            'prediction': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predictions/save', methods=['GET'])
def save_prediction():
    try:
        # Get parameters from query string
        user_id = request.args.get('user_id')
        predicted_disease = request.args.get('predicted_disease')
        symptoms = request.args.get('symptoms')
        severity = request.args.get('severity')
        doctor_name = request.args.get('doctor_name', '')
        confidence = request.args.get('confidence', '70')
        
        # Validate required fields
        if not all([user_id, predicted_disease, symptoms, severity]):
            return jsonify({
                'success': False,
                'error': 'Missing required fields'
            }), 400
        
        # Truncate symptoms to 100 chars to match table schema
        symptoms_truncated = symptoms[:100]
        
        # Connect to database
        conn = connection()
        cur = conn.cursor()
        
        # Get user role
        cur.execute("SELECT role, full_name FROM role WHERE id = %s", (user_id,))
        user = cur.fetchone()
        
        if not user:
            cur.close()
            conn.close()
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        user_role = user[0]
        user_full_name = user[1]
        
        # If user is a doctor, store their name (truncated to 10), otherwise use provided name
        final_doctor_name = ''
        if user_role == 'doctor':
            final_doctor_name = user_full_name[:10]
        elif doctor_name:
            final_doctor_name = doctor_name[:10]
        
        # Insert prediction according to table schema: id, date, predicted_disease, symptoms, severity, status, doctor
        # Append confidence to predicted_disease to avoid schema change
        disease_with_confidence = f"{predicted_disease}|{confidence}"
        
        cur.execute(
            """INSERT INTO prediction (id, predicted_disease, symptoms, severity, status, doctor) 
               VALUES (%s, %s, %s, %s, %s, %s) RETURNING date""",
            (user_id, disease_with_confidence, symptoms_truncated, severity, 'completed', final_doctor_name)
        )
        
        prediction_date = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Prediction saved successfully',
            'date': prediction_date[0].isoformat() if prediction_date and prediction_date[0] else None
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/predictions/get', methods=['GET'])
def get_predictions():
    try:
        # Get user_id from query string
        user_id = request.args.get('user_id')
        
        if not user_id:
            return jsonify({
                'success': False,
                'error': 'Missing user_id'
            }), 400
        
        # Connect to database
        conn = connection()
        cur = conn.cursor()
        
        # Get all predictions for this user (id field stores user_id)
        # Check if the user is a doctor
        cur.execute("SELECT role, full_name FROM role WHERE id = %s", (user_id,))
        user_role_data = cur.fetchone()
        
        if user_role_data and user_role_data[0] == 'doctor':
            # If user is a doctor, fetch predictions where doctor column matches their name (truncated to 10 chars)
            doctor_name = user_role_data[1][:10]
            cur.execute(
                """SELECT id, date, predicted_disease, symptoms, severity, status, doctor
                   FROM prediction 
                   WHERE doctor = %s 
                   ORDER BY date DESC""",
                (doctor_name,)
            )
        else:
            # If patient, fetch by their ID
            cur.execute(
                """SELECT id, date, predicted_disease, symptoms, severity, status, doctor
                   FROM prediction 
                   WHERE id = %s 
                   ORDER BY date DESC""",
                (user_id,)
            )
        
        predictions = cur.fetchall()
        
        prediction_list = []
        for pred in predictions:
            # Parse symptoms string into list
            symptoms_list = pred[3].split(', ') if pred[3] else [pred[3]] if pred[3] else []
            
            # Parse disease and confidence
            raw_disease = pred[2]
            disease_name = raw_disease
            confidence_score = 70
            
            if '|' in raw_disease:
                parts = raw_disease.split('|')
                disease_name = parts[0]
                try:
                    confidence_score = float(parts[1])
                    # Format to 2 decimal places if it's a float, or int if it's a whole number
                    if confidence_score.is_integer():
                        confidence_score = int(confidence_score)
                    else:
                        confidence_score = round(confidence_score, 1)
                except:
                    pass
            
            prediction_list.append({
                'id': pred[0],
                'date': pred[1].strftime('%Y-%m-%d') if pred[1] else None,
                'prediction': disease_name,
                'symptoms': symptoms_list,
                'severity': pred[4],
                'status': pred[5] or 'Completed',
                'doctor': pred[6] or '',
                'confidence': confidence_score
            })
        
        cur.close()
        conn.close()
        
        return jsonify({
            'success': True,
            'predictions': prediction_list,
            'count': len(prediction_list)
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Public: List all doctors for patient contact-doctor page
@app.route('/api/doctors', methods=['GET'])
def list_doctors():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(
            """
            SELECT id, full_name, department, specialization,
                   qualification, experience, consulation_fee, status, licence_no
            FROM role
            WHERE role = 'doctor'
            ORDER BY full_name ASC
            """
        )
        rows = cur.fetchall()
        doctors = []
        for row in rows:
            doctors.append({
                'id': row[0],
                'name': row[1],
                'department': row[2] or '',
                'specialization': row[3] or '',
                'qualification': row[4] or '',
                'experience': row[5] or '',
                'consultation_fee': row[6] or '',
                'status': row[7] or 'active',
                'licence_no': row[8] or ''
            })
        cur.close()
        conn.close()
        return jsonify({'success': True, 'doctors': doctors}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Public: List all bookings (for Booking Status page)
@app.route('/api/bookings', methods=['GET'])
def list_bookings():
    try:
        conn = connection()
        cur = conn.cursor()
        
        doctor_name_filter = request.args.get('doctor_name')
        
        if doctor_name_filter:
            cur.execute(
                """
                SELECT booking_id, name, doctor, department, appointment, status
                FROM booking
                WHERE doctor = %s
                ORDER BY appointment DESC
                """,
                (doctor_name_filter,)
            )
        else:
            cur.execute(
                """
                SELECT booking_id, name, doctor, department, appointment, status
                FROM booking
                ORDER BY appointment DESC
                """
            )
        rows = cur.fetchall()
        bookings = []
        for row in rows:
            bookings.append({
                'booking_id': row[0],
                'name': row[1],
                'doctor': row[2],
                'department': row[3],
                'appointment': row[4].isoformat() if row[4] else None,
                'status': row[5]
            })
        cur.close()
        conn.close()
        return jsonify({'success': True, 'bookings': bookings}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/overview', methods=['GET'])
def admin_overview():
    try:
        admin_token = request.args.get('admin_token')
        if not admin_token:
            return jsonify({'success': False, 'error': 'Missing admin token'}), 400

        conn = connection()
        cur = conn.cursor()

        # Verify admin
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        role_row = cur.fetchone()
        if not role_row or role_row[0] != 'admin':
            cur.close(); conn.close()
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403

        # Counts
        # Registered patients: unique patients who have a booking
        cur.execute("SELECT COUNT(DISTINCT name) FROM booking")
        patients_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM role WHERE role = 'doctor'")
        doctors_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM booking")
        bookings_count = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM prediction")
        predictions_count = cur.fetchone()[0]

        cur.close(); conn.close()
        return jsonify({
            'success': True,
            'overview': {
                'registeredPatients': patients_count,
                'doctors': doctors_count,
                'totalBookings': bookings_count,
                'predictions': predictions_count
            }
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/analytics', methods=['GET'])
def admin_analytics():
    try:
        admin_token = request.args.get('admin_token')
        if not admin_token:
            return jsonify({'success': False, 'error': 'Missing admin token'}), 400

        conn = connection()
        cur = conn.cursor()

        # Verify admin
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        role_row = cur.fetchone()
        if not role_row or role_row[0] != 'admin':
            cur.close(); conn.close()
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403

        # Monthly bookings count (last 6 months) for doctors under this admin
        cur.execute(
            """
            SELECT TO_CHAR(b.appointment, 'Mon') as month, DATE_TRUNC('month', b.appointment) as m,
                   COUNT(*)
            FROM booking b
            JOIN role r ON r.role = 'doctor' AND r.full_name = b.doctor AND r.admin_id = %s
            WHERE b.appointment IS NOT NULL
            GROUP BY 1,2
            ORDER BY m DESC
            LIMIT 6
            """, (admin_token,))
        booking_rows = cur.fetchall()
        bookings = [{ 'month': r[0], 'bookings': r[2] } for r in reversed(booking_rows)]

        # Monthly predictions count (last 6 months) for doctors under this admin (by doctor name match)
        cur.execute(
            """
            SELECT TO_CHAR(p.date, 'Mon') as month, DATE_TRUNC('month', p.date) as m,
                   COUNT(*)
            FROM prediction p
            JOIN role r ON r.role = 'doctor' AND p.doctor = r.full_name AND r.admin_id = %s
            WHERE p.date IS NOT NULL
            GROUP BY 1,2
            ORDER BY m DESC
            LIMIT 6
            """, (admin_token,))
        prediction_rows = cur.fetchall()
        predictions = [{ 'month': r[0], 'predictions': r[2] } for r in reversed(prediction_rows)]

        cur.close(); conn.close()
        return jsonify({'success': True, 'chart': { 'bookings': bookings, 'predictions': predictions }}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/patients', methods=['GET'])
def admin_patients():
    try:
        admin_token = request.args.get('admin_token')
        if not admin_token:
            return jsonify({'success': False, 'error': 'Missing admin token'}), 400
        conn = connection(); cur = conn.cursor()
        # Verify admin
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        role_row = cur.fetchone()
        if not role_row or role_row[0] != 'admin':
            cur.close(); conn.close()
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
        # Unique patients (name/email/phone/address) who booked with any doctor under this admin
        cur.execute(
            """
            SELECT DISTINCT p.full_name, p.email, p.phone, p.address
            FROM booking b
            JOIN role r ON r.role='doctor' AND r.full_name = b.doctor AND r.admin_id = %s
            JOIN role p ON p.role='patient' AND p.full_name = b.name
            ORDER BY 1 ASC
            """,
            (admin_token,)
        )
        rows = cur.fetchall()
        patients = [{'name': r[0], 'email': r[1], 'phone': r[2], 'address': r[3]} for r in rows]
        cur.close(); conn.close()
        return jsonify({'success': True, 'patients': patients}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/admin/bookings', methods=['GET'])
def admin_bookings():
    try:
        admin_token = request.args.get('admin_token')
        if not admin_token:
            return jsonify({'success': False, 'error': 'Missing admin token'}), 400
        conn = connection(); cur = conn.cursor()
        # Verify admin
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        role_row = cur.fetchone()
        if not role_row or role_row[0] != 'admin':
            cur.close(); conn.close()
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403
        # Bookings under doctors registered by this admin
        cur.execute(
            """
            SELECT b.booking_id, b.name, b.doctor, b.department, b.appointment, b.status
            FROM booking b
            JOIN role r ON r.role='doctor' AND r.full_name = b.doctor AND r.admin_id = %s
            ORDER BY b.appointment DESC
            """,
            (admin_token,)
        )
        rows = cur.fetchall()
        bookings = [{
            'booking_id': r[0],
            'name': r[1],
            'doctor': r[2],
            'department': r[3],
            'appointment': r[4].isoformat() if r[4] else None,
            'status': r[5]
        } for r in rows]
        cur.close(); conn.close()
        return jsonify({'success': True, 'bookings': bookings}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/bookings/update-status', methods=['GET'])
def update_booking_status():
    try:
        booking_id = request.args.get('booking_id')
        status = request.args.get('status')
        if not booking_id or not status:
            return jsonify({'success': False, 'error': 'Missing booking_id or status'}), 400
        conn = connection()
        cur = conn.cursor()
        cur.execute("UPDATE booking SET status = %s WHERE booking_id = %s", (status.lower(), booking_id))
        conn.commit()
        cur.close(); conn.close()
        return jsonify({'success': True, 'message': 'Status updated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/bookings/update-appointment', methods=['GET'])
def update_booking_appointment():
    try:
        booking_id = request.args.get('booking_id')
        date_str = request.args.get('date')  # YYYY-MM-DD
        time_str = request.args.get('time')  # HH:MM
        if not all([booking_id, date_str, time_str]):
            return jsonify({'success': False, 'error': 'Missing booking_id, date or time'}), 400
        from datetime import datetime
        try:
            appointment_dt = datetime.fromisoformat(f"{date_str}T{time_str}:00")
        except Exception:
            return jsonify({'success': False, 'error': 'Invalid date/time format'}), 400
        conn = connection(); cur = conn.cursor()
        cur.execute("UPDATE booking SET appointment = %s, status = 'pending' WHERE booking_id = %s", (appointment_dt, booking_id))
        conn.commit(); cur.close(); conn.close()
        return jsonify({'success': True, 'message': 'Appointment updated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/bookings/delete', methods=['GET'])
def delete_booking():
    try:
        booking_id = request.args.get('booking_id')
        if not booking_id:
            return jsonify({'success': False, 'error': 'Missing booking_id'}), 400
        conn = connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM booking WHERE booking_id = %s", (booking_id,))
        conn.commit()
        cur.close(); conn.close()
        return jsonify({'success': True, 'message': 'Booking deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/doctors/delete', methods=['GET'])
def delete_doctor():
    try:
        admin_token = request.args.get('admin_token')
        doctor_id = request.args.get('doctor_id')
        
        if not admin_token or not doctor_id:
            return jsonify({'success': False, 'error': 'Missing admin_token or doctor_id'}), 400

        conn = connection()
        cur = conn.cursor()
        
        # Verify admin
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        role_row = cur.fetchone()
        if not role_row or role_row[0] != 'admin':
            cur.close(); conn.close()
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403

        # Delete doctor
        cur.execute("DELETE FROM role WHERE id = %s AND role = 'doctor'", (doctor_id,))
        conn.commit()
        cur.close(); conn.close()
        
        return jsonify({'success': True, 'message': 'Doctor deleted'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/auth/update-doctor', methods=['GET'])
def update_doctor():
    try:
        admin_token = request.args.get('admin_token')
        doctor_id = request.args.get('doctor_id')
        if not admin_token or not doctor_id:
            return jsonify({'success': False, 'error': 'Missing admin_token or doctor_id'}), 400

        conn = connection()
        cur = conn.cursor()
        # Verify admin
        cur.execute("SELECT role FROM role WHERE id = %s", (admin_token,))
        role_row = cur.fetchone()
        if not role_row or role_row[0] != 'admin':
            cur.close(); conn.close()
            return jsonify({'success': False, 'error': 'Unauthorized'}), 403

        updates = []
        values = []
        mapping = {
            'name': 'full_name', 'email': 'email', 'phone': 'phone', 'address': 'address',
            'department': 'department', 'specialization': 'specialization', 'qualification': 'qualification',
            'experience': 'experience', 'licence_no': 'licence_no', 'consultation_fee': 'consulation_fee', 'status': 'status'
        }
        for param, column in mapping.items():
            val = request.args.get(param)
            if val is not None:
                updates.append(f"{column} = %s")
                values.append(val)
        if not updates:
            cur.close(); conn.close()
            return jsonify({'success': False, 'error': 'No fields to update'}), 400
        values.append(doctor_id)
        query = f"UPDATE role SET {', '.join(updates)} WHERE id = %s AND role = 'doctor'"
        cur.execute(query, tuple(values))
        conn.commit()
        cur.close(); conn.close()
        return jsonify({'success': True, 'message': 'Doctor updated'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/bookings/create', methods=['GET'])
def create_booking():
    try:
        # Required params
        patient_name = request.args.get('patient_name')
        doctor_name = request.args.get('doctor_name')
        department = request.args.get('department')
        date_str = request.args.get('date')  # YYYY-MM-DD
        time_str = request.args.get('time')  # HH:MM

        if not all([patient_name, doctor_name, department, date_str, time_str]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400

        # Compose timestamp from date and time
        from datetime import datetime
        try:
            appointment_dt = datetime.fromisoformat(f"{date_str}T{time_str}:00")
        except Exception:
            return jsonify({'success': False, 'error': 'Invalid date/time format'}), 400

        # Create booking
        booking_id = generate_code()
        conn = connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO booking(booking_id, name, doctor, department, appointment)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (str(booking_id), patient_name, doctor_name, department, appointment_dt)
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'success': True, 'message': 'Booking created', 'booking_id': str(booking_id)}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Generate and download PDF for a user's prediction (most recent or by date)
@app.route('/api/predictions/pdf', methods=['GET'])
def download_prediction_pdf():
    try:
        user_id = request.args.get('user_id')
        date_str = request.args.get('date')  # optional exact date match (YYYY-MM-DD)
        if not user_id:
            return jsonify({'success': False, 'error': 'Missing user_id'}), 400

        conn = connection(); cur = conn.cursor()
        if date_str:
            cur.execute(
                """
                SELECT id, date, predicted_disease, symptoms, severity, status, doctor
                FROM prediction
                WHERE id = %s AND TO_CHAR(date, 'YYYY-MM-DD') = %s
                ORDER BY date DESC
                LIMIT 1
                """,
                (user_id, date_str)
            )
        else:
            cur.execute(
                """
                SELECT id, date, predicted_disease, symptoms, severity, status, doctor
                FROM prediction
                WHERE id = %s
                ORDER BY date DESC
                LIMIT 1
                """,
                (user_id,)
            )
        row = cur.fetchone()
        cur.close(); conn.close()
        if not row:
            return jsonify({'success': False, 'error': 'Prediction not found'}), 404

        pid, pdate, disease, symptoms, severity, status, doctor = row
        date_fmt = pdate.strftime('%Y-%m-%d %H:%M') if pdate else ''
        symptoms_html = ''
        if symptoms:
            items = ''.join(f'<li>{s.strip()}</li>' for s in symptoms.split(',') if s.strip())
            symptoms_html = f'<ul>{items}</ul>'

        html = f"""
        <html>
        <head><meta charset='utf-8'><style>
        body {{ font-family: Arial, sans-serif; padding: 24px; color: #222; }}
        h1 {{ color: #0b7285; margin: 0 0 8px; }}
        .meta {{ color: #555; margin-bottom: 16px; }}
        .section {{ margin: 16px 0; padding: 12px; background: #f8f9fa; border-left: 4px solid #0b7285; }}
        .label {{ font-weight: bold; }}
        </style></head>
        <body>
          <h1>Prediction Report</h1>
          <div class='meta'>Date: {date_fmt}</div>
          <div class='section'><span class='label'>Patient ID:</span> {pid}</div>
          <div class='section'><span class='label'>Predicted Disease:</span> {disease}</div>
          <div class='section'><span class='label'>Severity:</span> {severity}</div>
          <div class='section'><span class='label'>Status:</span> {status}</div>
          <div class='section'><span class='label'>Doctor:</span> {doctor or ''}</div>
          <div class='section'><span class='label'>Symptoms:</span> {symptoms_html or '-'}
          </div>
        </body></html>
        """

        pdf_bytes = BytesIO()
        HTML(string=html).write_pdf(pdf_bytes)
        pdf_bytes.seek(0)
        filename = f"prediction_{pid}_{pdate.strftime('%Y%m%d%H%M') if pdate else 'report'}.pdf"
        return send_file(pdf_bytes, mimetype='application/pdf', as_attachment=True, download_name=filename)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

