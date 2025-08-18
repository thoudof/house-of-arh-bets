-- Update existing tables to regenerate schema
-- This migration ensures all changes are reflected in the types

-- Add any missing columns or constraints if needed
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Update triggers to ensure updated_at is maintained
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure all tables have proper RLS policies
-- (policies already exist, this is just to trigger schema regeneration)