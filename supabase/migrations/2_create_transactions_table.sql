DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('sale','purchase','transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    type transaction_type NOT NULL,
    date BIGINT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    country TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT different_parties CHECK (seller_id != buyer_id)
);