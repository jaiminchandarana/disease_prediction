from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import psycopg2
import admin
import patient

app = Flask(__name__)
CORS(app)

def get_user_friendly_error(error):
    """Convert database errors to user-friendly messages"""
    if "phone_check" in str(error):
        return "Phone number format is wrong. Please check the phone number format."
    elif "email" in str(error).lower():
        return "Email format is wrong. Please enter a legit email address."
    elif "unique" in str(error).lower():
        return "This record already exists. Please use a different ID."
    else:
        return f"Database error: {str(error)}"
    
@app.route('/api/admin', methods=['POST'])
def add_admin():
    try:
        data = request.json
        admin.add_admin(
            data['first_name'],data['last_name'],data['hospital'],data['phone'],data['email'],data['address'],data['password']
        )
        return jsonify({'success': True, 'message': 'Admin added successfully'})
    except psycopg2.errors.CheckViolation as e:
        error_msg = get_user_friendly_error(e)
        print(f"Check violation error: {str(e)}")
        return jsonify({'success': False, 'error': error_msg}), 400
    except psycopg2.errors.UniqueViolation as e:
        error_msg = get_user_friendly_error(e)
        print(f"Unique violation error: {str(e)}")
        return jsonify({'success': False, 'error': error_msg}), 400
    except Exception as e:
        print(f"Error in add_admin_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500
        
@app.route('/api/patient', methods=['POST'])
def add_patient():
    try:
        data = request.get_json(force=True)
        required_fields = ['name', 'email', 'password', 'address', 'phone', 'role']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'error': f'{field} is required'}), 400

        # Parse full name into first and last name
        full_name = data['name'].strip()
        name_parts = full_name.split()
        first_name = name_parts[0]
        last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

        # Only process if role is patient (matching frontend role options)
        if data['role'] == 'patient':
            result = patient.add_patient(
                first_name,
                last_name,
                data['phone'],
                data['email'],
                data['address'],
                data['password']
            )
            
            # Check if there was an error
            if result and "Error" in result:
                return jsonify({'success': False, 'error': result}), 500
            
            return jsonify({'success': True, 'message': 'Patient registered successfully'})
        elif data['role'] == 'doctor':
            # You might want to add doctor registration logic here later
            return jsonify({'success': False, 'error': 'Doctor registration not implemented yet'}), 400
        else:
            return jsonify({'success': False, 'error': 'Wrong role selected'}), 400
            
    except psycopg2.errors.CheckViolation as e:
        error_msg = get_user_friendly_error(e)
        print(f"Check violation error: {str(e)}")
        return jsonify({'success': False, 'error': error_msg}), 400
    except psycopg2.errors.UniqueViolation as e:
        error_msg = get_user_friendly_error(e)
        print(f"Unique violation error: {str(e)}")
        return jsonify({'success': False, 'error': error_msg}), 400
    except Exception as e:
        print(f"Error in add_patient_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/patient/<patient_id>', methods=['DELETE'])
def delete_patient_api(patient_id):
    try:
        result = patient.delete_patient(patient_id)
        if result and "Error" in result:
            return jsonify({'success': False, 'error': result}), 500
        return jsonify({'success': True, 'message': 'Patient deleted successfully'})
    except Exception as e:
        print(f"Error in delete_patient_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/patient/<patient_id>', methods=['PUT'])
def update_patient_api(patient_id):
    try:
        data = request.get_json(force=True)
        required_fields = ['first_name', 'last_name', 'phone', 'email']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        result = patient.update_patient(
            patient_id,
            data['first_name'],
            data['last_name'],
            data['phone'],
            data['email']
        )
        if result and "Error" in result:
            return jsonify({'success': False, 'error': result}), 500
        return jsonify({'success': True, 'message': 'Patient updated successfully'})
        
    except psycopg2.errors.CheckViolation as e:
        error_msg = get_user_friendly_error(e)
        print(f"Check violation error: {str(e)}")
        return jsonify({'success': False, 'error': error_msg}), 400
    except psycopg2.errors.UniqueViolation as e:
        error_msg = get_user_friendly_error(e)
        print(f"Unique violation error: {str(e)}")
        return jsonify({'success': False, 'error': error_msg}), 400
    except Exception as e:
        print(f"Error in update_patient_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/patient/password', methods=['PUT'])
def update_patient_password_api():
    try:
        data = request.get_json(force=True)
        
        # Validate required fields
        required_fields = ['email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'error': f'{field} is required'}), 400
        
        result = patient.update_patient_password(data['email'], data['password'])
        
        if result and "Error" in result:
            return jsonify({'success': False, 'error': result}), 500
        return jsonify({'success': True, 'message': 'Password updated successfully'})
        
    except Exception as e:
        print(f"Error in update_patient_password_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/patients/admin/<admin_id>', methods=['GET'])
def fetch_patients_by_admin_api(admin_id):
    try:
        result = patient.fetch_patient_by_admin(admin_id)
        
        if isinstance(result, str) and "Error" in result:
            return jsonify({'success': False, 'error': result}), 500
        
        return jsonify({'success': True, 'data': result})
        
    except Exception as e:
        print(f"Error in fetch_patients_by_admin_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/patients/doctor/<doctor_id>', methods=['GET'])
def fetch_patients_by_doctor_api(doctor_id):
    try:
        result = patient.fetch_patient_by_doctor(doctor_id)
        
        if isinstance(result, str) and "Error" in result:
            return jsonify({'success': False, 'error': result}), 500
        
        return jsonify({'success': True, 'data': result})
        
    except Exception as e:
        print(f"Error in fetch_patients_by_doctor_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/patient/id/<email>', methods=['GET'])
def fetch_patient_id_api(email):
    try:
        result = patient.fetch_patient_id(email)
        
        if isinstance(result, str) and "Error" in result:
            return jsonify({'success': False, 'error': result}), 500
        
        return jsonify({'success': True, 'patient_id': result})
        
    except Exception as e:
        print(f"Error in fetch_patient_id_api: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'success': False, 'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)