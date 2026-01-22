-- Create Database
DROP DATABASE IF EXISTS repair_order_db;
CREATE DATABASE IF NOT EXISTS repair_order_db;
USE repair_order_db;

-- Create Repair Orders Table
DROP TABLE IF EXISTS repair_orders;
CREATE TABLE repair_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    arrival_number VARCHAR(50) NOT NULL,
    arrival_date DATE NOT NULL,
    store VARCHAR(100) NOT NULL,
    division VARCHAR(50) NOT NULL,
    device_name VARCHAR(200) NOT NULL,
    number_inventory VARCHAR(100),
    issue TEXT,
    repair_note TEXT,
    departure_date DATE,
    departure_number VARCHAR(50),
    repair_order VARCHAR(10),
    ship_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Users Table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Roles Table
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    can_create BOOLEAN DEFAULT FALSE,
    can_read BOOLEAN DEFAULT FALSE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE
);

-- Insert Roles
INSERT INTO roles (role_name, description, can_create, can_read, can_update, can_delete) VALUES
('admin', 'Admin can perform all operations', TRUE, TRUE, TRUE, TRUE),
('user', 'User can only create repair orders', TRUE, TRUE, FALSE, FALSE);

-- Insert Sample Users (password: admin123 and user123)
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2b$10$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5YmMxSUmGEJqq', 'admin@example.com', 'admin'),
('user', '$2b$10$kOHV.Ynx7jH63LqpCpJM3eLLX3Doz4N2oQDvEk8rvWbfIzNJnLhKW', 'user@example.com', 'user');

-- Insert Sample Data
INSERT INTO repair_orders (arrival_number, arrival_date, store, division, device_name, number_inventory, issue, repair_note, departure_date, departure_number, repair_order, ship_address) VALUES
('568441', '2025-01-02', 'LEMAHABANG', 'MO', 'TIMBANGAN DIGITAL', 'TB0059', 'SENSOR KERTAS SERING LOSS', 'GANTI HEAD', '2025-01-05', 'LAHNOSUNG', 'V', 'ANDRE'),
('498204', '2025-01-05', 'LEMAHABANG', 'ITS', 'CPU ADM STOCK', 'OPU0592', 'MATOT', 'RUSAK POWER SUPPLY', NULL, NULL, NULL, NULL),
('586738', '2025-01-06', 'LEMAHABANG', 'MO', 'OPU MO', 'OPU0582', 'RUSAK WINDOWS', 'INSTALL ULANG', '2025-01-07', '497899', 'V', 'ANDRE'),
('520870', '2025-01-06', 'JATILO', 'ITS', 'FINGER ASSESLI + ADAPTOR', '-', 'JAM TELAT 40 MENIT', 'BATERAI BEIS + GANTI BATRIE', NULL, NULL, NULL, NULL),
('516644', '2025-01-08', 'PLAJU', 'ITS', 'PRINTER EPSON LX300', 'PRT0022', 'HEAD PRINTER BERDARAR', NULL, NULL, NULL, NULL, NULL);
