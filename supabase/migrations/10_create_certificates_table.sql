DO $$ BEGIN
    CREATE TYPE certificate_status AS ENUM ('draft', 'pending_payment', 'payment_confirmed', 'complete', 'cancelled');
    CREATE TYPE certificate_verification_status AS ENUM ('registered','authenticated','certified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS certificates (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    type_id TEXT NOT NULL,
    status certificate_status NOT NULL DEFAULT 'draft',
    verification_status certificate_verification_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);