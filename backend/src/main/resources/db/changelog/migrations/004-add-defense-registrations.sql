-- liquibase formatted sql

-- changeset thesis:add-defense-registration-noti-type runInTransaction:false
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'notification_type' AND e.enumlabel = 'DEFENSE_REGISTRATION_SUBMITTED') THEN
        ALTER TYPE notification_type ADD VALUE 'DEFENSE_REGISTRATION_SUBMITTED';
    END IF;
END $$;

-- changeset thesis:create-defense-reg-status-enum runInTransaction:false
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'defense_reg_status') THEN
        CREATE TYPE defense_reg_status AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED');
    END IF;
END $$;

-- changeset thesis:create-defense-registrations-table
CREATE TABLE IF NOT EXISTS defense_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thesis_id UUID NOT NULL REFERENCES theses(id),
    report_path VARCHAR(500) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    report_size BIGINT,
    source_code_path VARCHAR(500) NOT NULL,
    source_code_name VARCHAR(255) NOT NULL,
    source_code_size BIGINT,
    slide_path VARCHAR(500) NOT NULL,
    slide_name VARCHAR(255) NOT NULL,
    slide_size BIGINT,
    status defense_reg_status NOT NULL DEFAULT 'SUBMITTED',
    note TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_defense_reg_thesis ON defense_registrations(thesis_id);
