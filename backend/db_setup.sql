-- Run these commands in your Render Database (using psql, pgAdmin, or DBeaver)

-- 1. Create Role Table
CREATE TABLE IF NOT EXISTS role (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(10) NOT NULL,
    address VARCHAR(100) NOT NULL,
    department VARCHAR(15),
    specialization VARCHAR(15),
    qualification VARCHAR(15),
    experience VARCHAR(15),
    licence_no VARCHAR(20),
    consulation_fee VARCHAR(10),
    status VARCHAR(10),
    admin_id VARCHAR(10)
);

-- 2. Create Booking Table
CREATE TABLE IF NOT EXISTS booking (
    booking_id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    doctor VARCHAR(20) NOT NULL,
    department VARCHAR(20) NOT NULL,
    appointment TIMESTAMP NOT NULL,
    status VARCHAR(10) DEFAULT 'pending'
);

-- 3. Create Prediction Table
CREATE TABLE IF NOT EXISTS prediction (
    id VARCHAR(50) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    predicted_disease VARCHAR(50) NOT NULL,
    symptoms VARCHAR(100) NOT NULL,
    severity VARCHAR(10) NOT NULL,
    status VARCHAR(10) DEFAULT 'completed' NOT NULL,
    doctor VARCHAR(10) DEFAULT 'self'
);

-- 4. Create Contact Table
CREATE TABLE IF NOT EXISTS contact (
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    message VARCHAR(200) NOT NULL,
    query_id BIGINT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
