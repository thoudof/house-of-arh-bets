-- Удаляем все нахуй и создаем с нуля

-- Удаляем триггеры
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_predictions_updated_at ON public.predictions;
DROP TRIGGER IF EXISTS update_challenges_updated_at ON public.challenges;
DROP TRIGGER IF EXISTS update_user_stats_trigger ON public.predictions;

-- Удаляем функции
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_stats_on_prediction_change() CASCADE;

-- Очищаем все таблицы
DELETE FROM public.user_achievements;
DELETE FROM public.challenge_predictions;
DELETE FROM public.predictions;
DELETE FROM public.challenges;
DELETE FROM public.user_stats;
DELETE FROM public.profiles;

-- Удаляем пользователей из auth.users (кроме системных)
DELETE FROM auth.users WHERE email LIKE '%@telegram.local' OR email LIKE '%@local.app';

-- Создаем функцию для обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем правильную функцию для создания нового пользователя
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
        role
    ) VALUES (
        NEW.id,
        COALESCE(telegram_user_data ->> 'telegram_id', telegram_user_data ->> 'id'),
        telegram_user_data ->> 'username',
        COALESCE(telegram_user_data ->> 'first_name', 'User'),
        telegram_user_data ->> 'last_name',
        telegram_user_data ->> 'photo_url',
        'user'::user_role  -- Всем по умолчанию роль user
    );
    
    -- Создаем статистику пользователя
    INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем функцию для обновления статистики при изменении прогнозов
CREATE OR REPLACE FUNCTION public.update_user_stats_on_prediction_change()
RETURNS TRIGGER AS $$
DECLARE
    user_total_predictions INTEGER;
    user_wins INTEGER;
    user_total_stake NUMERIC;
    user_total_profit NUMERIC;
    current_win_streak INTEGER;
    best_win_streak INTEGER;
    avg_coefficient NUMERIC;
    win_rate_calc NUMERIC;
    roi_calc NUMERIC;
BEGIN
    -- Рассчитываем статистику по всем прогнозам пользователя
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'win'),
        COALESCE(SUM(stake), 0),
        COALESCE(SUM(profit), 0),
        COALESCE(AVG(coefficient), 0)
    INTO 
        user_total_predictions,
        user_wins,
        user_total_stake,
        user_total_profit,
        avg_coefficient
    FROM public.predictions 
    WHERE user_id = NEW.user_id AND status IN ('win', 'loss');

    -- Рассчитываем процент побед
    win_rate_calc := CASE 
        WHEN user_total_predictions > 0 THEN (user_wins::NUMERIC / user_total_predictions * 100)
        ELSE 0 
    END;

    -- Рассчитываем ROI
    roi_calc := CASE 
        WHEN user_total_stake > 0 THEN (user_total_profit / user_total_stake * 100)
        ELSE 0 
    END;

    -- Рассчитываем текущую серию побед
    WITH recent_predictions AS (
        SELECT status, ROW_NUMBER() OVER (ORDER BY updated_at DESC) as rn
        FROM public.predictions 
        WHERE user_id = NEW.user_id AND status IN ('win', 'loss')
        ORDER BY updated_at DESC
    ),
    streak_calc AS (
        SELECT 
            CASE 
                WHEN LAG(status) OVER (ORDER BY rn) != status OR LAG(status) OVER (ORDER BY rn) IS NULL 
                THEN 1 
                ELSE 0 
            END as streak_break,
            status,
            rn
        FROM recent_predictions
    )
    SELECT 
        CASE 
            WHEN (SELECT status FROM recent_predictions WHERE rn = 1) = 'win'
            THEN COUNT(*)
            ELSE 0
        END
    INTO current_win_streak
    FROM streak_calc 
    WHERE rn <= (
        SELECT COALESCE(MIN(rn), 1) 
        FROM streak_calc 
        WHERE streak_break = 1 AND rn > 1
    ) AND status = 'win';

    -- Рассчитываем лучшую серию
    WITH prediction_sequences AS (
        SELECT 
            status,
            updated_at,
            ROW_NUMBER() OVER (ORDER BY updated_at) - 
            ROW_NUMBER() OVER (PARTITION BY status ORDER BY updated_at) as grp
        FROM public.predictions 
        WHERE user_id = NEW.user_id AND status IN ('win', 'loss')
    )
    SELECT COALESCE(MAX(win_count), 0)
    INTO best_win_streak
    FROM (
        SELECT COUNT(*) as win_count
        FROM prediction_sequences 
        WHERE status = 'win'
        GROUP BY grp
    ) t;

    -- Обновляем статистику пользователя
    UPDATE public.user_stats 
    SET 
        total_predictions = user_total_predictions,
        win_rate = ROUND(win_rate_calc, 2),
        roi = ROUND(roi_calc, 2),
        average_coefficient = ROUND(avg_coefficient, 2),
        profit = ROUND(user_total_profit, 2),
        current_streak = current_win_streak,
        best_streak = GREATEST(best_win_streak, current_streak),
        total_stake = ROUND(user_total_stake, 2),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггеры
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
    BEFORE UPDATE ON public.predictions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON public.challenges
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_trigger
    AFTER INSERT OR UPDATE ON public.predictions
    FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_on_prediction_change();