-- Упрощаем схему базы данных для новой системы авторизации

-- Очищаем старые данные
TRUNCATE TABLE public.user_achievements CASCADE;
TRUNCATE TABLE public.user_stats CASCADE; 
TRUNCATE TABLE public.challenge_predictions CASCADE;
TRUNCATE TABLE public.challenges CASCADE;
TRUNCATE TABLE public.predictions CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Обновляем таблицу профилей для упрощенной схемы
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS rank;

-- Добавляем новые поля для Telegram авторизации
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language_code TEXT;

-- Создаем индекс для быстрого поиска по telegram_id
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON public.profiles(telegram_id);

-- Обновляем функцию создания пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    telegram_user_data JSONB;
BEGIN
    -- Извлекаем данные пользователя Telegram
    telegram_user_data := NEW.raw_user_meta_data;
    
    -- Создаем профиль
    INSERT INTO public.profiles (
        user_id, 
        telegram_id, 
        username, 
        first_name, 
        last_name, 
        avatar_url,
        is_premium,
        language_code
    ) VALUES (
        NEW.id,
        COALESCE(telegram_user_data ->> 'telegram_id', telegram_user_data ->> 'id'),
        telegram_user_data ->> 'username',
        COALESCE(telegram_user_data ->> 'first_name', 'User'),
        telegram_user_data ->> 'last_name',
        telegram_user_data ->> 'photo_url',
        COALESCE((telegram_user_data ->> 'is_premium')::boolean, false),
        telegram_user_data ->> 'language_code'
    );
    
    -- Создаем статистику пользователя
    INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;