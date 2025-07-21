-- Добавляем новые значения в enum user_tier только если их еще нет
DO $$
BEGIN
    -- Добавляем telegram_premium если его нет
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'telegram_premium' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_tier')) THEN
        ALTER TYPE user_tier ADD VALUE 'telegram_premium';
    END IF;
    
    -- Добавляем premium если его нет
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'premium' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_tier')) THEN
        ALTER TYPE user_tier ADD VALUE 'premium';
    END IF;
    
    -- Добавляем platinum если его нет
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'platinum' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_tier')) THEN
        ALTER TYPE user_tier ADD VALUE 'platinum';
    END IF;
END$$;

-- Делаем пользователя верифицированным от лица администрации
UPDATE public.profiles 
SET 
  is_verified = true,
  verification_date = NOW(),
  verification_type = 'admin'
WHERE user_id = '124330e5-9193-46b7-8f5d-69f8aba02bf6';