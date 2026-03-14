-- liquibase formatted sql

-- changeset thesis:rename-scores-to-grades
ALTER TABLE IF EXISTS scores RENAME TO grades;
ALTER TABLE IF EXISTS score_approval RENAME TO grade_approvals;

-- changeset thesis:rename-score-type-enum runInTransaction:false
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'score_type') THEN
        ALTER TYPE score_type RENAME TO grade_type;
    END IF;
END $$;

-- changeset thesis:rename-notification-type-score runInTransaction:false
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'notification_type' AND e.enumlabel = 'SCORE_PUBLISHED') THEN
        ALTER TYPE notification_type RENAME VALUE 'SCORE_PUBLISHED' TO 'GRADE_PUBLISHED';
    END IF;
END $$;

-- changeset thesis:rename-score-type-column
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grades' AND column_name = 'score_type') THEN
        ALTER TABLE grades RENAME COLUMN score_type TO grade_type;
    END IF;
END $$;
