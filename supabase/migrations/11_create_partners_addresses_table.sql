CREATE TABLE IF NOT EXISTS partners_addresses (
    id BIGSERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    street_number TEXT,
    street_name TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);