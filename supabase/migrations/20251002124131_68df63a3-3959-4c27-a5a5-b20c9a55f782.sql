-- Шаг 1: Обновляем политику RLS на таблице profiles - теперь пользователи видят только свои полные профили
DROP POLICY IF EXISTS "Профили видны всем" ON public.profiles;

CREATE POLICY "Пользователи видят свой профиль"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Шаг 2: Создаем представление с безопасными публичными данными профилей
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  first_name,
  display_name,
  avatar_url,
  bio,
  is_verified,
  verification_date,
  tier,
  last_active_at,
  created_at
FROM public.profiles
WHERE public_profile = true;

-- Шаг 3: Даем права на чтение представления всем аутентифицированным пользователям
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Шаг 4: Создаем функцию для безопасного получения публичного профиля по user_id
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  first_name text,
  display_name text,
  avatar_url text,
  bio text,
  is_verified boolean,
  verification_date timestamp with time zone,
  tier user_tier,
  last_active_at timestamp with time zone,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    user_id,
    first_name,
    display_name,
    avatar_url,
    bio,
    is_verified,
    verification_date,
    tier,
    last_active_at,
    created_at
  FROM public.profiles
  WHERE user_id = profile_user_id 
    AND public_profile = true;
$$;

-- Комментарии для документации
COMMENT ON VIEW public.public_profiles IS 'Безопасное представление профилей пользователей без чувствительных данных (telegram_id, telegram_username)';
COMMENT ON FUNCTION public.get_public_profile IS 'Безопасная функция для получения публичного профиля конкретного пользователя';