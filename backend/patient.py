from connection import connection
from generate import generate_code,generate_password
from mail import send_credential
import bcrypt

def add_patient(first_name,last_name,phone,email,address,password,admin_id=None,doctor_id=None):
    try:
        patient_id = generate_code()
        passcode = password
        hashed_password = bcrypt.hashpw(passcode.encode('utf-8'),bcrypt.gensalt())
        password = hashed_password.decode('utf-8')
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO patient (patient_id,first_name,last_name,phone,email,address,admin_id,doctor_id,password) VALUES {(patient_id,first_name.lower(),last_name.lower(),phone,email.lower(),address.lower(),admin_id,doctor_id,password)}")
        conn.commit()
        cur.close()
        conn.close()
        send_credential(email,passcode)
    except Exception as e:
        return "Error adding patient."
    
def fetch_patient_password(email):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT password FROM patient WHERE email = {email}")
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        return row
    except Exception as e:
        return "Error fetching password."
    
def delete_patient(patient_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM patient WHERE patient_id = {patient_id}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error deleting patient."
    
def update_patient(patient_id,first_name,last_name,phone,email):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE patient SET first_name = {first_name.lower()}, last_name = {last_name.lower()}, phone = {phone}, email = {email.lower()} WHERE patient_id = {patient_id}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error updating patient."
    
def update_patient_password(email,password):
    try:
        password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE patient SET password = {password} WHERE patient_id = {email}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error deleting patient password."
    
def fetch_patient_by_admin(admin_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM patient WHERE admin_id = {admin_id}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching patient."

def fetch_patient_by_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM patient WHERE admin_id = {doctor_id}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching patient."
    
def fetch_patient_id(email):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT patient_id FROM patient WHERE email = {email}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error fetching patient id."