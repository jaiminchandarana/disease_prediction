from connection import connection
from generate import generate_time,generate_code

def add_booking(patient_id,doctor_id,admin_id,decision,prediction,description,precaution,symptom):
    try:
        prediction_id = generate_code()
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO booking (patient_id,doctor_id,admin_id,decision,prediction,description,precaution,symptom,prediction_id) VALUES {(patient_id,doctor_id,admin_id,decision,prediction,description,precaution,symptom,prediction_id)}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error adding booking."

def update_booking_handled_at_accepted(patient_id):
    try:
        handled_at = generate_time()
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE booking SET handled_at = '{handled_at}', decision = 'accepted' WHERE patient_id = {patient_id}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error updating booking."
    
def update_booking_handled_at_rejected(patient_id):
    try:
        handled_at = generate_time()
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE booking SET handled_at = '{handled_at}', decision = 'rejected' WHERE patient_id = {patient_id}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error updating booking."
    
def update_booking_prediction(patient_id,prediction,description,precaution,symptom):
    # try:
        predicted_at = generate_time()
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE booking SET prediction = '{prediction.lower()}', decision = 'predicted', predicted_at = '{predicted_at}', description = '{description.lower()}', precaution = '{precaution.lower()}', symptom = '{symptom.lower()}'  WHERE patient_id = {patient_id}")
        conn.commit()
        cur.close()
        conn.close()
    # except Exception as e:
    #     return "Error updating booking."
    
update_booking_prediction(406626,"abc","test","test","test")
def fetch_booking_by_admin(admin_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.created_at, b.decision FROM doctor d JOIN booking b ON d.admin_id = b.admin_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.admin_id =  {admin_id}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."
    
def fetch_booking_by_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.created_at, b.decision FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.doctor_id =  {doctor_id}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."
    
def fetch_booking_by_patient(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.created_at, b.decision FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE p.patient_id =  {patient_id}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."
    
def accepted_admin(admin_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.admin_id = b.admin_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.admin_id =  {admin_id} AND b.decision = 'accepted'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."

def rejected_admin(admin_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.admin_id = b.admin_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.admin_id =  {admin_id} AND b.decision = 'rejected'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."

def pending_admin(admin_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.admin_id = b.admin_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.admin_id =  {admin_id} AND b.decision = 'pending'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."
    
def predicted_admin(admin_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.admin_id = b.admin_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.admin_id =  {admin_id} AND b.decision = 'predicted'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."

def accepted_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.doctor_id =  {doctor_id} AND b.decision = 'accepted'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."
    
def rejected_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.doctor_id =  {doctor_id} AND b.decision = 'rejected'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."

def pending_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.doctor_id =  {doctor_id} AND b.decision = 'pending'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."
    
def predicted_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.doctor_id =  {doctor_id} AND b.decision = 'predicted'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."

def accepted_patient(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE p.patient_id =  {patient_id} AND b.decision = 'accepted'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."

def rejected_patient(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE p.patient_id =  {patient_id} AND b.decision = 'rejected'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."

def pending_patient(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE p.patient_id =  {patient_id} AND b.decision = 'pending'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."
    
def predicted_patient(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.created_at, b.handled_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE p.patient_id =  {patient_id} AND b.decision = 'predicted'")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching booking."