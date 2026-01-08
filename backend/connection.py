import psycopg2
import os

def connection():
    # Check for DATABASE_URL environment variable (standard for Render)
    db_url = os.environ.get('DATABASE_URL')
    
    # If not set, but we are on Render (custom check), use the provided URL
    if not db_url and os.environ.get('RENDER'):
        db_url = 'postgresql://disease_prediction_jpox_user:86lJJTz9aItYO00G0Gg2ODEyYvOsHSob@dpg-d5f832ruibrs7396mh9g-a/disease_prediction_jpox'
    
    if db_url:
        conn = psycopg2.connect(db_url, sslmode='require')
    else:
        # Local fallback
        conn = psycopg2.connect(
            host = 'localhost',
            database = 'disease_prediction',
            user = 'postgres',
            password = 'JDCpostgres.@'
        )
    return conn