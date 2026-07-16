-- SmileGuard AI — Supabase Schema Update
-- Run this in your Supabase SQL Editor

-- ─── Add new columns to assessments ─────────────────────────────────────────
ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS confidence       FLOAT        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS predicted_class  TEXT         DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS all_classes      JSONB        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS scan_breakdown   JSONB        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS future_risk_30d  INT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS future_risk_90d  INT          DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS recommendations  JSONB        DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS breakdown        JSONB        DEFAULT NULL;

-- ─── Index for fast analytics queries ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_assessments_user_created
  ON assessments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessments_level
  ON assessments(level);

-- ─── Appointments table (if not already created) ─────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dentist_id       UUID DEFAULT NULL,
  dentist_name     TEXT,
  dentist_specialty TEXT,
  appointment_date DATE,
  appointment_time TEXT,
  note             TEXT,
  status           TEXT DEFAULT 'pending',
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE assessments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments  ENABLE ROW LEVEL SECURITY;

-- Users can only see their own records
CREATE POLICY IF NOT EXISTS "Users read own assessments"
  ON assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users update own assessments"
  ON assessments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users delete own assessments"
  ON assessments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users read own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users insert own appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "Users delete own appointments"
  ON appointments FOR DELETE
  USING (auth.uid() = user_id);
