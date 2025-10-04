from connection import connection
from generate import generate_code,generate_password
from mail import send_credential
import bcrypt

def add_admin(first_name,last_name,hospital,phone,email,address,password):
    try:
        admin_id = generate_code()
        passcode = password
        hashed_password = bcrypt.hashpw(passcode.encode('utf-8'),bcrypt.gensalt())
        password = hashed_password.decode('utf-8')
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"INSERT INTO admin (admin_id,first_name,last_name,hospital,phone,email,address,password) VALUES {(admin_id,first_name.lower(),last_name.lower(),hospital.lower(),phone,email.lower(),address.lower(),password)}")
        conn.commit()
        cur.close()
        conn.close()
        send_credential(email,passcode)
    except Exception as e:
        return "Error adding admin."

def update_admin(admin_id,first_name,last_name,hospital,phone,email):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE admin SET first_name = {first_name.lower()}, last_name = {last_name.lower()}, hospital = {hospital.lower()}, phone = {phone}, email = {email.lower()} WHERE admin_id = {admin_id}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error updating admin."
        
def update_admin_password(email,password):
    try:
        password = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE admin SET password = {password} WHERE email = {email}")
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        return "Error updating password."