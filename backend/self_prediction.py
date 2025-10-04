from connection import connection
from generate import generate_code

def add_self_prediction(patient_id,prediction,description,precaution,symptom):
    try:
        prediction_id = generate_code()
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            INSERT INTO self_prediction 
            (patient_id,prediction,description,precaution,symptom,prediction_id)  
            VALUES {(patient_id,prediction,description,precaution,symptom,prediction_id)}         
        ''')
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error adding prediction."
    
def fetch_prediction_card_by_patient(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT 'patient_prediction' as SOURCE TABLE, d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.prediction_id, b.prediction, FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE p.patient_id =  {patient_id}
            UNION ALL
            SELECT 'self_prediction' as SOURCE TABLE, NULL AS doctor_fullname, pa.first_name || ' ' || pa.last_name as patient_fullname, NULL AS doctor_id, pr.patient_id, pr.prediction_id, pr.prediction FROM patient pa JOIN self_prediction pr ON pa.patient_id = pr.patient_id WHERE pr.patient_id = {patient_id}        
        ''')
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching prediction."

def fetch_prediction_card_by_visit(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT d.first_name || ' ' || d.last_name AS doctor_fullname, p.first_name || ' ' || p.last_name AS patient_fullname,b.doctor_id, b.patient_id, b.prediction_id, b.prediction, FROM doctor d JOIN booking b ON d.doctor_id = b.doctor_id JOIN patient p ON b.patient_id = p.patient_id WHERE p.patient_id =  {patient_id}
        ''')
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching prediction."

def fetch_prediction_card_by_self(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT pa.first_name || ' ' || pa.last_name as patient_fullname, pr.patient_id, pr.prediction_id, pr.prediction FROM patient pa JOIN self_prediction pr ON pa.patient_id = pr.patient_id WHERE pr.patient_id = {patient_id}        
        ''')
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching prediction."

def fetch_prediction_pdf_by_self(prediction_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT pa.first_name || ' ' || pa.last_name as patient_fullname, pr.patient_id, TO_CHAR(pr.predicted_at, 'DD FMMonth YYYY, HH12:MI AM') AS formatted_time, pr.prediction, pr.description, pr.symptom, pr.precaution  FROM patient pa JOIN self_prediction pr ON pa.patient_id = pr.patient_id WHERE pr.prediction_id = {prediction_id}        
        ''')
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching prediction."
    
def fetch_prediction_pdf_by_visit(prediction_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            SELECT b.patient_id, b.doctor_id, b.prediction, b.description, b.precaution, b.symptom, TO_CHAR(b.predicted_at,'DD FMMonth YYYY, HH12:MI AM') AS formatted_time, p.first_name || ' ' || p.last_name AS patient_name, d.first_name || ' ' || d.last_name AS doctor_name FROM booking b join patient p ON b.patient_id = p.patient_id JOIN doctor d ON b.doctor_id = d.doctor_id WHERE b.prediction_id = 363969
        ''')
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching prediction."