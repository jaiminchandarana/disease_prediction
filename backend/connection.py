import psycopg2
import os

def connection():
    # Check if running on Render (production)
    if os.environ.get('RENDER'):
        db_url = os.environ.get('DATABASE_URL')
        if db_url:
            return psycopg2.connect(db_url, sslmode='require')
            
    # Local fallback (if not on Render, or DATABASE_URL missing)
    try:
        return psycopg2.connect(
            host='localhost',
            database='disease_prediction',
            user='postgres',
            password='JDCpostgres.@'
        )
    except Exception as e:
        print(f"Local database connection failed: {e}")
        return None