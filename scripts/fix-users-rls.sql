-- Fix users table RLS policies and auto-create profiles
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Add RLS policies for the users table
-- Allow authenticated users to insert their own profile
CREATE POLICY "users_insert_own" ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- Allow authenticated users to update their own profile
CREATE POLICY "users_update_own" ON users FOR UPDATE
  USING (id = auth.uid());

-- Allow authenticated users to read all profiles
CREATE POLICY "users_select_authenticated" ON users FOR SELECT
  USING (true);

-- 2. Auto-create profile when a new user signs up (bypasses RLS)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill existing auth users that don't have profiles yet
INSERT INTO public.users (id, email, display_name)
SELECT
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'display_name',
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    ''
  )
FROM auth.users
ON CONFLICT (id) DO NOTHING;
