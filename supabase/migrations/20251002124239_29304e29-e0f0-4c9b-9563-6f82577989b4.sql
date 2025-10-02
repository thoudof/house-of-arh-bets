-- Исправляем последнюю функцию handle_new_telegram_user
CREATE OR REPLACE FUNCTION public.handle_new_telegram_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  telegram_user_data JSONB;
BEGIN
  telegram_user_data := NEW.raw_user_meta_data;
  
  INSERT INTO public.profiles (
    user_id, 
    telegram_id, 
    telegram_username,
    first_name, 
    last_name,
    language_code,
    avatar_url
  ) VALUES (
    NEW.id,
    (telegram_user_data ->> 'id')::BIGINT,
    telegram_user_data ->> 'username',
    COALESCE(telegram_user_data ->> 'first_name', 'Пользователь'),
    telegram_user_data ->> 'last_name',
    COALESCE(telegram_user_data ->> 'language_code', 'ru'),
    telegram_user_data ->> 'photo_url'
  );
  
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;

-- Удаляем SECURITY DEFINER view и создаем обычное view
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles AS
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

-- Права доступа
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;