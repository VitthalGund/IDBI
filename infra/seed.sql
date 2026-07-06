-- Create schemas
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    type VARCHAR(20) NOT NULL -- 'RETAIL' or 'MSME'
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'CREDIT' or 'DEBIT'
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PENDING', 'PAID', 'OVERDUE'
    due_date DATE NOT NULL
);

-- Clear existing data
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE accounts CASCADE;

-- Insert Mock Accounts
INSERT INTO accounts (account_number, account_name, balance, type) VALUES
('1000000001', 'Retail User', 15000.50, 'RETAIL'),
('2000000001', 'MSME Business', 250000.00, 'MSME');

-- Insert Mock Transactions for Retail User (account_id = 1)
INSERT INTO transactions (account_id, amount, type, description, timestamp) VALUES
(1, 500.00, 'DEBIT', 'Grocery Store', NOW() - INTERVAL '1 day'),
(1, 1500.00, 'DEBIT', 'Electricity Bill', NOW() - INTERVAL '2 days'),
(1, 10000.00, 'CREDIT', 'Salary', NOW() - INTERVAL '5 days'),
(1, 200.00, 'DEBIT', 'Coffee Shop', NOW() - INTERVAL '6 days'),
(1, 1000.00, 'DEBIT', 'Online Shopping', NOW() - INTERVAL '7 days'),
(1, 5000.00, 'CREDIT', 'Transfer from Friend', NOW() - INTERVAL '10 days'),
(1, 300.00, 'DEBIT', 'Mobile Recharge', NOW() - INTERVAL '12 days'),
(1, 2000.00, 'DEBIT', 'Restaurant', NOW() - INTERVAL '15 days'),
(1, 150.00, 'DEBIT', 'Transport', NOW() - INTERVAL '16 days'),
(1, 50.00, 'DEBIT', 'Subscription', NOW() - INTERVAL '20 days');

-- Insert Mock Transactions for MSME User (account_id = 2)
INSERT INTO transactions (account_id, amount, type, description, timestamp) VALUES
(2, 50000.00, 'CREDIT', 'Client Payment A', NOW() - INTERVAL '1 day'),
(2, 15000.00, 'DEBIT', 'Vendor Payment X', NOW() - INTERVAL '2 days'),
(2, 10000.00, 'DEBIT', 'Office Supplies', NOW() - INTERVAL '3 days'),
(2, 100000.00, 'CREDIT', 'Client Payment B', NOW() - INTERVAL '5 days'),
(2, 5000.00, 'DEBIT', 'Internet Bill', NOW() - INTERVAL '6 days'),
(2, 20000.00, 'DEBIT', 'Logistics', NOW() - INTERVAL '8 days'),
(2, 75000.00, 'CREDIT', 'Client Payment C', NOW() - INTERVAL '10 days'),
(2, 25000.00, 'DEBIT', 'Vendor Payment Y', NOW() - INTERVAL '12 days'),
(2, 2000.00, 'DEBIT', 'Miscellaneous', NOW() - INTERVAL '15 days'),
(2, 30000.00, 'DEBIT', 'Rent', NOW() - INTERVAL '20 days');

-- Insert Mock MSME Invoices (account_id = 2)
INSERT INTO invoices (account_id, invoice_number, amount, status, due_date) VALUES
(2, 'INV-2026-001', 50000.00, 'PENDING', CURRENT_DATE + INTERVAL '5 days'),
(2, 'INV-2026-002', 75000.00, 'OVERDUE', CURRENT_DATE - INTERVAL '2 days'),
(2, 'INV-2026-003', 20000.00, 'PAID', CURRENT_DATE - INTERVAL '10 days');
