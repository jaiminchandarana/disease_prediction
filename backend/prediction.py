from connection import connection

def fetch_prediction_card_by_admin(admin_id):
    conn = connection()
    cur = conn.cursor()
    cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.predicted_at, b.prediction, b.prediction_id FROM doctor d JOIN booking b ON d.admin_id = b.admin_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.admin_id =  {admin_id}")
    rows = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return rows
    
def fetch_prediction_card_by_doctor(doctor_id):
    conn = connection()
    cur = conn.cursor()
    cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.predicted_at, b.prediction, b.prediction_id FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE d.doctor_id =  {doctor_id}")
    rows = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return rows

def fetch_prediction_pdf(prediction_id):
    conn = connection()
    cur = conn.cursor()
    cur.execute(f"SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.predicted_at, b.prediction FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE b.prediction_id =  {prediction_id}")
    rows = cur.fetchall()
    conn.commit()
    cur.close()
    conn.close()
    return rows
