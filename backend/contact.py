from connection import connection
from generate import generate_code
from mail import send_query

def add_query(name,email,subject,message):
    try:
        query_id = generate_code()
        conn = connection()
        cur = conn.cursor()
        cur.execute(f'''
            INSERT INTO contact
            (name,email,subject,message,query_id)
            VALUES {(name.lower(),email.lower(),subject.lower(),message.lower(),query_id)}            
        ''')
        conn.commit()
        cur.close()
        conn.close()
        send_query(email,subject,query_id)
    except Exception as e:
        return "Error adding query."
    
def fetch_query(query_id):
    try:
        conn = connection()
        cur = conn.cursor()
        cur.execute(f"SELECT * FROM contact WHERE query_id = {query_id}")
        rows = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return "Error fetching data."