import random
from datetime import datetime

def generate_code():
    try:
        code = random.randint(1,999999)
        return code
    except Exception as e:
        return "Error generating code."
    
def generate_password(email,phone):
    try:
        email = email
        phone = str(phone)
        password = email[:4]+phone[:4]
        return password
    except Exception as e:
        return "Error generating password."

def generate_time():
    try:
        currunt_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        return currunt_time
    except Exception as e:
        return "Error generating timestamp."