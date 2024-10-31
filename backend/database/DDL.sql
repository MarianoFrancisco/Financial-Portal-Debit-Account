CREATE DATABASE IF NOT EXISTS financial_portal_debit_account;
USE financial_portal_debit_account;

CREATE TABLE IF NOT EXISTS currencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS exchange_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origin_currency_id INT NOT NULL,
    destination_currency_id INT NOT NULL,
    rate DECIMAL(10, 4) NOT NULL,
    last_update BIGINT NOT NULL,
    FOREIGN KEY (origin_currency_id) REFERENCES currencies(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (destination_currency_id) REFERENCES currencies(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS account_tiers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(50) NOT NULL UNIQUE,
    opening_fee DECIMAL(10, 2) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tokens_linked_api (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(1024) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(15) NOT NULL UNIQUE,
    name VARCHAR(65) NOT NULL,
    lastname VARCHAR(65),
    email VARCHAR(100) NOT NULL UNIQUE,
    pin VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    genre ENUM('Male', 'Female', 'Other') DEFAULT 'Other',
    registration_date BIGINT NOT NULL,
    active TINYINT(1) DEFAULT 1,
    notifyme TINYINT(1) DEFAULT 0,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bank_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_name VARCHAR(255) NOT NULL UNIQUE,
    account_number BIGINT NOT NULL UNIQUE,
    user_id INT NOT NULL,
    account_tier_id INT NOT NULL,
    currency_id INT NOT NULL,
    balance DECIMAL(18, 2) DEFAULT 0.00,
    creation_date BIGINT NOT NULL,
    close INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (account_tier_id) REFERENCES account_tiers(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (currency_id) REFERENCES currencies(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_api_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    external_user_id INT NOT NULL,
    account_id INT NOT NULL,
    origin_api VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_account_id INT NOT NULL,
    transaction_type ENUM('Income', 'Expense') NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    transaction_date BIGINT NOT NULL,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX(bank_account_id, transaction_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS account_closures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bank_account_id INT NOT NULL,
    closure_reason VARCHAR(255),
    closure_date BIGINT NOT NULL,
    FOREIGN KEY (bank_account_id) REFERENCES bank_accounts(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;