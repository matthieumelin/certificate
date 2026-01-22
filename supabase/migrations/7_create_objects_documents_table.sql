DO $$ BEGIN
    CREATE TYPE object_document_type AS ENUM ('invoice','warranty_card','certificate_of_authenticity','service_document');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;