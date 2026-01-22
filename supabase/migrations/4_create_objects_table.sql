CREATE TABLE IF NOT EXISTS objects (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type_id BIGINT NOT NULL REFERENCES object_types(id) ON DELETE RESTRICT,
    picture_ids BIGINT[] NOT NULL DEFAULT '{}',
    document_ids BIGINT[] NOT NULL DEFAULT '{}',
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    estimed_price NUMERIC(10, 2) NOT NULL CHECK (estimed_price >= 0),
    reference TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    manufacture INTEGER NOT NULL,
    has_original_documents BOOLEAN NOT NULL DEFAULT false,
    nick_name TEXT,
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)