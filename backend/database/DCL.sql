-- Create new user
CREATE USER 'financial_portal_debit_account_cunoc'@'%' IDENTIFIED BY 'FinancialPortalDebitAccount!';

-- All privileges on database `financial_portal_debit_account_cunoc`
GRANT ALL PRIVILEGES ON financial_portal_debit_account.* TO 'financial_portal_debit_account_cunoc'@'%';

-- Save al privileges
FLUSH PRIVILEGES;
