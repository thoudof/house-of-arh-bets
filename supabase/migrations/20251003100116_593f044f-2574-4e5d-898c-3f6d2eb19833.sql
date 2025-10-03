-- Ensure trigger to auto-create profile on new auth user insert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_telegram_user();
  END IF;
END $$;

-- Backfill: create profiles for existing auth users missing a profile (Telegram users)
INSERT INTO public.profiles (
  user_id,
  telegram_id,
  telegram_username,
  first_name,
  last_name,
  language_code,
  avatar_url
)
SELECT 
  u.id,
  (u.raw_user_meta_data ->> 'id')::BIGINT,
  u.raw_user_meta_data ->> 'username',
  COALESCE(u.raw_user_meta_data ->> 'first_name', 'Пользователь'),
  u.raw_user_meta_data ->> 'last_name',
  COALESCE(u.raw_user_meta_data ->> 'language_code', 'ru'),
  u.raw_user_meta_data ->> 'photo_url'
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL
  AND (u.raw_user_meta_data ->> 'id') IS NOT NULL;

-- Ensure a stats row exists for every profile
INSERT INTO public.user_stats (user_id)
SELECT p.user_id
FROM public.profiles p
LEFT JOIN public.user_stats us ON us.user_id = p.user_id
WHERE us.user_id IS NULL;