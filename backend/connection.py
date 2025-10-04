import psycopg2

def connection():
    try:
        conn = psycopg2.connect(
            host = 'localhost',
            database = 'disease_prediction',
            user = 'postgres',
            password = 'JDCpostgres.@'
        )
        return conn
    except Exception as e:
        return "Error connecting database."