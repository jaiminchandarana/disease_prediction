from connection import connection
from generate import generate_code,generate_password
from mail import send_credential
import bcrypt

def add_doctor(first_name,last_name,hospital,phone,email,department,experience,admin_id):
    try:
        doctor_id = generate_code()
        passcode = generate_password(email,phone)
        hashed_password = bcrypt.hashpw(passcode.encode('utf-8'),bcrypt.gensalt())
        password = hashed_password.decode('utf-8')
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO doctor (doctor_id,first_name,last_name,hospital,phone,email,department,experience,admin_id,password) VALUES {(doctor_id,first_name.lower(),last_name.lower(),hospital.lower(),phone,email.lower(),department.lower(),experience,admin_id,password)}")
        conn.commit()
        cur.close()
        conn.close()
        send_credential(email,passcode)
    except Exception as e:
        return "Error adding doctor."
    
def delete_doctor(doctor_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM doctor WHERE doctor_id = {doctor_id}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error deleting doctor."
    
def update_doctor(doctor_id,first_name,last_name,hospital,phone,email):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE doctor SET first_name = {first_name.lower()}, last_name = {last_name.lower()}, hospital = {hospital.lower()}, phone = {phone}, email = {email.lower()} WHERE doctor_id = {doctor_id}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error updating doctor."
    
def update_doctor_password(email,password):
    try:
        password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE doctor SET password = {password} WHERE email = {email}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error updating doctor."
    
def fetch_doctor(admin_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM doctor WHERE admin_id = {admin_id}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching doctor."

def doctor_list():
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT first_name || ' ' || last_name AS full_name FROM doctor")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching doctor"

def doctor_list_by_hospital(hospital):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT first_name || ' ' || last_name AS full_name FROM doctor WHERE hospital = {hospital}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching doctor"

def find_doctor_id(name):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT doctor_id FROM doctor WHERE (first_name || ' ' || last_name AS full_name) = {name}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error finding doctor id"

def find_admin_id(name):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT admin_id FROM doctor WHERE (SELECT first_name || ' ' || last_name AS full_name FROM doctor) = {name}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error finding admin id"