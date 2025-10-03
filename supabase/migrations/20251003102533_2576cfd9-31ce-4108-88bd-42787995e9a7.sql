-- Add explicit policy to block all anonymous access to profiles table
-- This prevents attackers from enumerating sensitive user data

-- Drop existing permissive policies and recreate them as restrictive
DROP POLICY IF EXISTS "Пользователи видят свой профиль" ON public.profiles;
DROP POLICY IF EXISTS "Пользователи могут обновлять свой профиль" ON public.profiles;
DROP POLICY IF EXISTS "Пользователи могут создавать свой профиль" ON public.profiles;

-- Create explicit deny policy for anonymous users (executed first due to RESTRICTIVE)
CREATE POLICY "Блокировка анонимного доступа к профилям"
ON public.profiles
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- Recreate policies for authenticated users only
CREATE POLICY "Пользователи видят свой профиль"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свой профиль"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут создавать свой профиль"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Ensure public_profiles view has proper access for anonymous users
-- Grant SELECT on public_profiles view to anon role
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.public_profiles TO authenticated;