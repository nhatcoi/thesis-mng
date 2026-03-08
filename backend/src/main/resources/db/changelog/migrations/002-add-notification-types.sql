-- liquibase formatted sql

-- changeset thesis:add-noti-proposed runInTransaction:false
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'notification_type' AND e.enumlabel = 'TOPIC_PROPOSED') THEN
        ALTER TYPE notification_type ADD VALUE 'TOPIC_PROPOSED';
    END IF;
END $$;
