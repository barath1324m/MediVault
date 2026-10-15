-- =======================================================
-- MediVault Database Schema
-- Database: medivault_db
-- =======================================================

DROP DATABASE IF EXISTS medivault_db;
CREATE DATABASE medivault_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medivault_db;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Medical Visits Table
CREATE TABLE medical_visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    visit_date DATE NOT NULL,
    symptoms TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    hospital_name VARCHAR(150) NOT NULL,
    doctor_name VARCHAR(150) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_visits_user_date (user_id, visit_date),
    CONSTRAINT fk_medical_visits_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Prescriptions Table
CREATE TABLE prescriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medical_visit_id BIGINT NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_prescriptions_visit (medical_visit_id),
    CONSTRAINT fk_prescriptions_visit FOREIGN KEY (medical_visit_id) REFERENCES medical_visits(id) ON DELETE CASCADE
) ENGINE=InnoDB;
