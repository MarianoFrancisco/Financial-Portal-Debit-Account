CREATE DATABASE IF NOT EXISTS financial_portal_debit_account;
USE financial_portal_debit_account;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(15) NOT NULL UNIQUE,
    name VARCHAR(65) NOT NULL,
    lastname VARCHAR(65),
    email VARCHAR(100) NOT NULL UNIQUE,
    pin VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    genre ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
    registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active TINYINT(1) DEFAULT 1,
    notifyme TINYINT(1) DEFAULT 0
) ENGINE=InnoDB;