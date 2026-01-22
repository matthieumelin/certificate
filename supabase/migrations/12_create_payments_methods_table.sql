DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS payments_methods (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type payment_method_type NOT NULL DEFAULT 'card',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);