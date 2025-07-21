-- Полное удаление всех таблиц и систем
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.challenge_predictions CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.predictions CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Удаляем функции
DROP FUNCTION IF EXISTS public.update_user_stats_on_prediction_change() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Удаляем типы
DROP TYPE IF EXISTS public.prediction_status CASCADE;
DROP TYPE IF EXISTS public.challenge_status CASCADE;
DROP TYPE IF EXISTS public.prediction_type CASCADE;
DROP TYPE IF EXISTS public.challenge_type CASCADE;

-- Создаем новые типы
CREATE TYPE public.prediction_status AS ENUM ('pending', 'win', 'loss', 'cancelled');
CREATE TYPE public.prediction_type AS ENUM ('sport', 'crypto', 'stock', 'other');
CREATE TYPE public.challenge_type AS ENUM ('bank_growth', 'win_streak', 'roi_challenge');
CREATE TYPE public.challenge_status AS ENUM ('active', 'completed', 'failed');

-- Создаем таблицу профилей пользователей
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    telegram_id TEXT NOT NULL UNIQUE,
    username TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    avatar_url TEXT,
    is_premium BOOLEAN DEFAULT false,
    language_code TEXT DEFAULT 'ru',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для профилей
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политики для профилей
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile" ON public.profiles  
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Создаем таблицу статистики пользователей  
CREATE TABLE public.user_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    total_predictions INTEGER DEFAULT 0,
    win_rate NUMERIC(5,2) DEFAULT 0.00,
    roi NUMERIC(8,2) DEFAULT 0.00,
    average_coefficient NUMERIC(8,2) DEFAULT 0.00,
    profit NUMERIC(12,2) DEFAULT 0.00,
    total_stake NUMERIC(12,2) DEFAULT 0.00,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для статистики
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Политики для статистики
CREATE POLICY "Users can view all stats" ON public.user_stats
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own stats" ON public.user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats  
    FOR UPDATE USING (auth.uid() = user_id);

-- Создаем таблицу прогнозов
CREATE TABLE public.predictions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    prediction TEXT NOT NULL,
    type public.prediction_type NOT NULL,
    category TEXT NOT NULL,
    coefficient NUMERIC(8,2) NOT NULL,
    stake NUMERIC(12,2),
    profit NUMERIC(12,2),
    status public.prediction_status DEFAULT 'pending',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    analyst TEXT,
    is_public BOOLEAN DEFAULT true,
    time_left TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для прогнозов
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Политики для прогнозов
CREATE POLICY "Users can view public predictions" ON public.predictions
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own predictions" ON public.predictions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions" ON public.predictions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions" ON public.predictions
    FOR DELETE USING (auth.uid() = user_id);

-- Создаем таблицу челленджей
CREATE TABLE public.challenges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    creator_name TEXT NOT NULL,
    title TEXT NOT NULL,
    type public.challenge_type NOT NULL,
    start_bank NUMERIC(12,2) NOT NULL,
    current_bank NUMERIC(12,2) NOT NULL,
    total_steps INTEGER,
    current_step INTEGER DEFAULT 1,
    status public.challenge_status DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для челленджей
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Политики для челленджей
CREATE POLICY "Users can view all challenges" ON public.challenges
    FOR SELECT USING (true);

CREATE POLICY "Users can create challenges" ON public.challenges
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own challenges" ON public.challenges
    FOR UPDATE USING (auth.uid() = creator_id);

-- Создаем таблицу прогнозов в челленджах
CREATE TABLE public.challenge_predictions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL
);

-- Включаем RLS для прогнозов челленджей
ALTER TABLE public.challenge_predictions ENABLE ROW LEVEL SECURITY;

-- Политики для прогнозов челленджей
CREATE POLICY "Users can view challenge predictions" ON public.challenge_predictions
    FOR SELECT USING (true);

CREATE POLICY "Challenge creators can manage predictions" ON public.challenge_predictions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.challenges 
            WHERE challenges.id = challenge_predictions.challenge_id 
            AND challenges.creator_id = auth.uid()
        )
    );

-- Создаем таблицу достижений
CREATE TABLE public.achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    condition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для достижений
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Политика для достижений
CREATE POLICY "Everyone can view achievements" ON public.achievements
    FOR SELECT USING (true);

-- Создаем таблицу достижений пользователей
CREATE TABLE public.user_achievements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- Включаем RLS для достижений пользователей
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Политики для достижений пользователей
CREATE POLICY "Users can view all user achievements" ON public.user_achievements
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Создаем функцию обновления updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем функцию для создания нового пользователя
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Создаем функцию обновления статистики при изменении прогноза
CREATE OR REPLACE FUNCTION public.update_user_stats_on_prediction_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
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
        best_streak = GREATEST(best_win_streak, current_win_streak),
        total_stake = ROUND(user_total_stake, 2),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$;

-- Создаем триггеры
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
    BEFORE UPDATE ON public.predictions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON public.challenges
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Триггер для создания нового пользователя
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Триггер для обновления статистики при изменении прогноза
CREATE TRIGGER update_user_stats_on_prediction_change
    AFTER INSERT OR UPDATE ON public.predictions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_stats_on_prediction_change();

-- Добавляем базовые достижения
INSERT INTO public.achievements (title, description, icon, condition) VALUES
('Первый прогноз', 'Сделайте свой первый прогноз', '🎯', 'first_prediction'),
('Первая победа', 'Выиграйте первый прогноз', '🏆', 'first_win'),
('Серия из 3', 'Выиграйте 3 прогноза подряд', '🔥', 'win_streak_3'),
('Серия из 5', 'Выиграйте 5 прогнозов подряд', '⚡', 'win_streak_5'),
('10 прогнозов', 'Сделайте 10 прогнозов', '📊', 'total_predictions_10'),
('50 прогнозов', 'Сделайте 50 прогнозов', '🎲', 'total_predictions_50'),
('70% винрейт', 'Достигните винрейта 70%', '💎', 'win_rate_70'),
('Прибыльность', 'Достигните ROI больше 20%', '💰', 'roi_20');