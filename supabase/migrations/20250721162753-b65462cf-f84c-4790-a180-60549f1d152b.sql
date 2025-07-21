-- Добавляем поле verified в таблицу profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Добавляем поле verification_date для отслеживания даты верификации
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Добавляем поле verification_type для отслеживания типа верификации (auto/manual)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS verification_type TEXT DEFAULT NULL;

-- Создаем функцию для автоматической верификации пользователей
CREATE OR REPLACE FUNCTION public.check_auto_verification()
RETURNS TRIGGER AS $$
DECLARE
    user_likes_count INTEGER;
    user_predictions_count INTEGER;
    user_win_rate NUMERIC;
BEGIN
    -- Получаем статистику пользователя
    SELECT 
        COALESCE(total_likes_received, 0),
        COALESCE(total_predictions, 0),
        CASE 
            WHEN total_predictions > 0 THEN (successful_predictions::NUMERIC / total_predictions::NUMERIC) * 100
            ELSE 0 
        END
    INTO user_likes_count, user_predictions_count, user_win_rate
    FROM public.user_stats 
    WHERE user_id = NEW.user_id;

    -- Проверяем условия для автоматической верификации
    IF user_likes_count >= 50 AND user_predictions_count >= 20 AND user_win_rate >= 60.0 THEN
        -- Обновляем профиль пользователя
        UPDATE public.profiles 
        SET 
            is_verified = true,
            verification_date = NOW(),
            verification_type = 'auto'
        WHERE user_id = NEW.user_id AND is_verified = false;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматической проверки верификации при обновлении статистики
DROP TRIGGER IF EXISTS trigger_check_auto_verification ON public.user_stats;
CREATE TRIGGER trigger_check_auto_verification
    AFTER UPDATE ON public.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.check_auto_verification();