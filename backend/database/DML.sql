USE financial_portal_debit_account;
INSERT INTO currencies (id, code, name)
VALUES 
    (1, 'GTQ', 'Quetzal'),
    (2, 'USD', 'US Dollar'),
    (3, 'EUR', 'Euro')
ON DUPLICATE KEY UPDATE
    name = VALUES(name);

INSERT INTO exchange_rates (id, origin_currency_id, destination_currency_id, rate, last_update) VALUES
    (1, 2, 1, 7.50, UNIX_TIMESTAMP()),
    (2, 3, 1, 10.00, UNIX_TIMESTAMP()),
    (3, 1, 2, 0.1333, UNIX_TIMESTAMP()),
    (4, 1, 3, 0.1000, UNIX_TIMESTAMP()),
    (5, 2, 3, 0.85, UNIX_TIMESTAMP()),
    (6, 3, 2, 1.18, UNIX_TIMESTAMP());

INSERT INTO account_tiers (id, tier_name, opening_fee)
VALUES 
    (1, 'basic', 200.00),
    (2, 'premium', 50.00),
    (3, 'plus', 50.00)
ON DUPLICATE KEY UPDATE
    opening_fee = VALUES(opening_fee);

INSERT INTO roles (id, role_name)
VALUES
    (1, 'Administrator'),
    (2, 'User');

INSERT INTO users (id, username, name, lastname, email, pin, phone, genre, registration_date, active, notifyme, role_id) VALUES 
(1, 'mariano', 'Mariano', 'Camposeco', 'mariano1941@outlook.es', 'a3db58d6c14880dacffd3275f5f897ef:bc5512706f3fae451eec82057ad290d4', '+50231840649', 'Male', UNIX_TIMESTAMP(), 1, 1, 2);

INSERT INTO bank_accounts (id, account_name, account_number, user_id, account_tier_id, currency_id, balance, creation_date, close)
VALUES 
    (1, 'mariano.basic@kizunamaya.com', 1234567890, 1, 1, 1, 5000.00, UNIX_TIMESTAMP(), 0),
    (2, 'mariano.premium@kizunamaya.com', 9876543210, 1, 2, 2, 15000.00, UNIX_TIMESTAMP(), 0),
    (3, 'mariano.plus@kizunamaya.com', 1122334455, 1, 3, 3, 2500.50, UNIX_TIMESTAMP(), 0);

INSERT INTO users (username, name, lastname, email, pin, phone, genre, registration_date, active, notifyme, role_id) VALUES 
('karla', 'Karla', 'Matias', 'karlamatias201830032@cunoc.edu.gt', 'a3db58d6c14880dacffd3275f5f897ef:bc5512706f3fae451eec82057ad290d4', '00000000', 'Female', UNIX_TIMESTAMP(), 1, 1, 2),
('estuardo', 'Estuardo', 'Ramos', 'estuardoramos201830358@cunoc.edu.gt', 'a3db58d6c14880dacffd3275f5f897ef:bc5512706f3fae451eec82057ad290d4', '00000000', 'Male', UNIX_TIMESTAMP(), 1, 1, 2),
('dylan', 'Dylan', 'Elias', 'dylanelias201931369@cunoc.edu.gt', 'a3db58d6c14880dacffd3275f5f897ef:bc5512706f3fae451eec82057ad290d4', '00000000', 'Male', UNIX_TIMESTAMP(), 1, 1, 2);

INSERT INTO bank_accounts (account_name, account_number, user_id, account_tier_id, currency_id, balance, creation_date, close)
VALUES 
    ('karla.plus@kizunamaya.com', 123455432, 5, 3, 3, 5000.00, UNIX_TIMESTAMP(), 0),
    ('estuardo.plus@kizunamaya.com', 123455433, 6, 3, 3, 5000.00, UNIX_TIMESTAMP(), 0),
    ('dylan.plus@kizunamaya.com', 123455434, 7, 3, 3, 5000.50, UNIX_TIMESTAMP(), 0);
