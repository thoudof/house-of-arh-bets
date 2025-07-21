
-- Пересоздаем функцию handle_new_user с правильными типами
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    telegram_user_data JSONB;
BEGIN
    -- Извлекаем данные пользователя Telegram
    telegram_user_data := NEW.raw_user_meta_data;
    
    -- Создаем профиль с ролью user по умолчанию
    INSERT INTO public.profiles (
        user_id, 
        telegram_id, 
        username, 
        first_name, 
        last_name, 
        avatar_url,
        role,
        rank
    ) VALUES (
        NEW.id,
        COALESCE(telegram_user_data ->> 'telegram_id', telegram_user_data ->> 'id'),
        telegram_user_data ->> 'username',
        COALESCE(telegram_user_data ->> 'first_name', 'User'),
        telegram_user_data ->> 'last_name',
        telegram_user_data ->> 'photo_url',
        'user'::user_role,
        'newbie'::user_rank
    );
    
    -- Создаем статистику пользователя
    INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Пересоздаем триггер
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
