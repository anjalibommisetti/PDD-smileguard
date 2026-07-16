-- Run this in your Supabase project → SQL Editor
-- Creates the appointments table for SmileGuard AI

CREATE TABLE IF NOT EXISTS public.appointments (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  dentist_name  text,
  dentist_specialty text,
  appointment_date  text,
  appointment_time  text,
  note          text,
  status        text DEFAULT 'pending',
  created_at    timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy: users can read their own appointments
CREATE POLICY "Users can view own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: users can insert their own appointments
CREATE POLICY "Users can insert own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can delete their own appointments
CREATE POLICY "Users can delete own appointments"
  ON public.appointments FOR DELETE
  USING (auth.uid() = user_id);

-- Also ensure assessments table has patient_name and insight columns
ALTER TABLE public.assessments 
  ADD COLUMN IF NOT EXISTS patient_name text,
  ADD COLUMN IF NOT EXISTS insight text;
