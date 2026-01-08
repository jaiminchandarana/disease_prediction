import psycopg2
import os

def connection():
    # Check for DATABASE_URL environment variable (standard for Render and Production)
    db_url = os.environ.get('DATABASE_URL')
    
    if db_url:
        return psycopg2.connect(db_url, sslmode='require')
    else:
        # Local fallback
        return psycopg2.connect(
            host = 'localhost',
            database = 'disease_prediction',
            user = 'postgres',
            password = 'JDCpostgres.@'
        )