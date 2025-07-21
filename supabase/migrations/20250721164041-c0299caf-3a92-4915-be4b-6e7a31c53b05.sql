-- Добавляем новые значения в enum user_tier
ALTER TYPE user_tier ADD VALUE 'telegram_premium';
ALTER TYPE user_tier ADD VALUE 'premium';
ALTER TYPE user_tier ADD VALUE 'platinum';

-- Делаем пользователя верифицированным от лица администрации
UPDATE public.profiles 
SET 
  is_verified = true,
  verification_date = NOW(),
  verification_type = 'admin'
WHERE user_id = '124330e5-9193-46b7-8f5d-69f8aba02bf6';