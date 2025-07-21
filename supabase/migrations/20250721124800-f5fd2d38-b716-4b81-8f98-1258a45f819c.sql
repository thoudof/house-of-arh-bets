-- Полная новая архитектура базы данных для Telegram приложения
-- Сначала удаляем все существующие таблицы и создаем новую структуру

-- Удаляем существующие таблицы в правильном порядке (учитывая зависимости)
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.challenge_predictions CASCADE;
DROP TABLE IF EXISTS public.predictions CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Удаляем существующие типы
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.user_rank CASCADE;
DROP TYPE IF EXISTS public.prediction_type CASCADE;
DROP TYPE IF EXISTS public.prediction_status CASCADE;
DROP TYPE IF EXISTS public.challenge_type CASCADE;
DROP TYPE IF EXISTS public.challenge_status CASCADE;

-- Создаем новые типы данных
CREATE TYPE public.user_role AS ENUM ('user', 'analyst', 'premium', 'vip', 'admin');
CREATE TYPE public.user_tier AS ENUM ('free', 'bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE public.prediction_type AS ENUM ('single', 'express', 'system', 'accumulator');
CREATE TYPE public.prediction_status AS ENUM ('pending', 'win', 'loss', 'cancelled', 'returned');
CREATE TYPE public.prediction_category AS ENUM ('football', 'basketball', 'tennis', 'hockey', 'esports', 'other');
CREATE TYPE public.subscription_type AS ENUM ('daily', 'weekly', 'monthly', 'season');
CREATE TYPE public.notification_type AS ENUM ('prediction', 'result', 'subscription', 'achievement', 'system');

-- Основная таблица профилей пользователей Telegram
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Telegram данные
  telegram_id BIGINT NOT NULL UNIQUE,
  telegram_username TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  language_code TEXT DEFAULT 'ru',
  
  -- Профиль пользователя
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  
  -- Роль и уровень
  role public.user_role DEFAULT 'user',
  tier public.user_tier DEFAULT 'free',
  
  -- Настройки
  notifications_enabled BOOLEAN DEFAULT true,
  auto_subscribe_enabled BOOLEAN DEFAULT false,
  public_profile BOOLEAN DEFAULT true,
  
  -- Метаданные
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Статистика пользователей
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Основная статистика прогнозов
  total_predictions INTEGER DEFAULT 0,
  successful_predictions INTEGER DEFAULT 0,
  failed_predictions INTEGER DEFAULT 0,
  pending_predictions INTEGER DEFAULT 0,
  
  -- Статистика по коэффициентам
  average_coefficient DECIMAL(8,2) DEFAULT 0.00,
  highest_coefficient DECIMAL(8,2) DEFAULT 0.00,
  
  -- Финансовая статистика
  total_stake DECIMAL(12,2) DEFAULT 0.00,
  total_profit DECIMAL(12,2) DEFAULT 0.00,
  total_loss DECIMAL(12,2) DEFAULT 0.00,
  roi DECIMAL(8,2) DEFAULT 0.00,
  
  -- Серии и достижения
  current_win_streak INTEGER DEFAULT 0,
  current_loss_streak INTEGER DEFAULT 0,
  best_win_streak INTEGER DEFAULT 0,
  best_loss_streak INTEGER DEFAULT 0,
  
  -- Рейтинг и уровень
  rating INTEGER DEFAULT 1000,
  level INTEGER DEFAULT 1,
  experience_points INTEGER DEFAULT 0,
  
  -- Подписки и лайки
  total_subscribers INTEGER DEFAULT 0,
  total_subscriptions INTEGER DEFAULT 0,
  total_likes_received INTEGER DEFAULT 0,
  total_likes_given INTEGER DEFAULT 0,
  
  -- Метаданные
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Прогнозы
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Основная информация о прогнозе
  title TEXT NOT NULL,
  description TEXT,
  event_name TEXT NOT NULL,
  type public.prediction_type NOT NULL DEFAULT 'single',
  category public.prediction_category NOT NULL DEFAULT 'football',
  
  -- Коэффициент и ставка
  coefficient DECIMAL(8,2) NOT NULL CHECK (coefficient > 0),
  stake DECIMAL(12,2) CHECK (stake >= 0),
  profit DECIMAL(12,2) DEFAULT 0,
  
  -- Статус и результат
  status public.prediction_status DEFAULT 'pending',
  result_note TEXT,
  
  -- Время событий
  event_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  prediction_deadline TIMESTAMP WITH TIME ZONE,
  result_time TIMESTAMP WITH TIME ZONE,
  
  -- Настройки видимости
  is_public BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  
  -- Статистика взаимодействий
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  
  -- Теги и категории
  tags TEXT[],
  league_name TEXT,
  competition_name TEXT,
  
  -- Метаданные
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Подписки пользователей на аналитиков
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscriber_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analyst_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Тип подписки
  type public.subscription_type NOT NULL DEFAULT 'monthly',
  
  -- Настройки уведомлений
  notifications_enabled BOOLEAN DEFAULT true,
  auto_bet_enabled BOOLEAN DEFAULT false,
  max_auto_bet_amount DECIMAL(12,2) DEFAULT 0,
  
  -- Временные рамки
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Статус
  is_active BOOLEAN DEFAULT true,
  is_trial BOOLEAN DEFAULT false,
  
  -- Метаданные
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(subscriber_id, analyst_id)
);

-- Лайки прогнозов
CREATE TABLE public.prediction_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, prediction_id)
);

-- Комментарии к прогнозам
CREATE TABLE public.prediction_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.prediction_comments(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  
  -- Статистика
  likes_count INTEGER DEFAULT 0,
  
  -- Статус
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Уведомления
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Связанные объекты
  prediction_id UUID REFERENCES public.predictions(id) ON DELETE CASCADE,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Статус
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  
  -- Данные для отправки в Telegram
  telegram_message_id INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Достижения системы
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_emoji TEXT NOT NULL,
  
  -- Условия получения
  condition_type TEXT NOT NULL, -- 'win_streak', 'total_predictions', 'roi', 'profit', etc.
  condition_value INTEGER NOT NULL,
  
  -- Награды
  experience_points INTEGER DEFAULT 0,
  tier_boost INTEGER DEFAULT 0,
  
  -- Видимость и сортировка
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Пользовательские достижения
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  
  -- Прогресс к достижению
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, achievement_id)
);

-- Сессии Telegram авторизации
CREATE TABLE public.telegram_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Telegram данные сессии
  telegram_id BIGINT NOT NULL,
  init_data_hash TEXT NOT NULL,
  auth_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Информация о сессии
  is_active BOOLEAN DEFAULT true,
  user_agent TEXT,
  ip_address INET,
  
  -- Время жизни сессии
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Включаем RLS для всех таблиц
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_sessions ENABLE ROW LEVEL SECURITY;

-- RLS политики для profiles
CREATE POLICY "Профили видны всем" ON public.profiles FOR SELECT USING (public_profile = true OR auth.uid() = user_id);
CREATE POLICY "Пользователи могут обновлять свой профиль" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Пользователи могут создавать свой профиль" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS политики для user_stats
CREATE POLICY "Статистика видна всем" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Пользователи могут обновлять свою статистику" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Пользователи могут создавать свою статистику" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS политики для predictions
CREATE POLICY "Публичные прогнозы видны всем" ON public.predictions FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Пользователи могут создавать прогнозы" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Пользователи могут обновлять свои прогнозы" ON public.predictions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Пользователи могут удалять свои прогнозы" ON public.predictions FOR DELETE USING (auth.uid() = user_id);

-- RLS политики для subscriptions
CREATE POLICY "Пользователи видят свои подписки" ON public.subscriptions FOR SELECT USING (auth.uid() = subscriber_id OR auth.uid() = analyst_id);
CREATE POLICY "Пользователи могут подписываться" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = subscriber_id);
CREATE POLICY "Пользователи могут управлять подписками" ON public.subscriptions FOR UPDATE USING (auth.uid() = subscriber_id);
CREATE POLICY "Пользователи могут отписываться" ON public.subscriptions FOR DELETE USING (auth.uid() = subscriber_id);

-- RLS политики для prediction_likes
CREATE POLICY "Лайки видны всем" ON public.prediction_likes FOR SELECT USING (true);
CREATE POLICY "Пользователи могут лайкать" ON public.prediction_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Пользователи могут убирать лайки" ON public.prediction_likes FOR DELETE USING (auth.uid() = user_id);

-- RLS политики для prediction_comments
CREATE POLICY "Комментарии видны всем" ON public.prediction_comments FOR SELECT USING (is_deleted = false);
CREATE POLICY "Пользователи могут комментировать" ON public.prediction_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Пользователи могут редактировать комментарии" ON public.prediction_comments FOR UPDATE USING (auth.uid() = user_id);

-- RLS политики для notifications
CREATE POLICY "Пользователи видят свои уведомления" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Система может создавать уведомления" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Пользователи могут отмечать как прочитанные" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS политики для achievements
CREATE POLICY "Достижения видны всем" ON public.achievements FOR SELECT USING (is_active = true);

-- RLS политики для user_achievements
CREATE POLICY "Достижения пользователей видны всем" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Система может давать достижения" ON public.user_achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Система может обновлять прогресс" ON public.user_achievements FOR UPDATE USING (true);

-- RLS политики для telegram_sessions
CREATE POLICY "Пользователи видят свои сессии" ON public.telegram_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Система может создавать сессии" ON public.telegram_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Система может обновлять сессии" ON public.telegram_sessions FOR UPDATE USING (true);

-- Создаем индексы для оптимизации
CREATE INDEX idx_profiles_telegram_id ON public.profiles(telegram_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_predictions_user_id ON public.predictions(user_id);
CREATE INDEX idx_predictions_status ON public.predictions(status);
CREATE INDEX idx_predictions_category ON public.predictions(category);
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at DESC);
CREATE INDEX idx_predictions_event_start_time ON public.predictions(event_start_time);
CREATE INDEX idx_subscriptions_analyst_id ON public.subscriptions(analyst_id);
CREATE INDEX idx_subscriptions_subscriber_id ON public.subscriptions(subscriber_id);
CREATE INDEX idx_prediction_likes_prediction_id ON public.prediction_likes(prediction_id);
CREATE INDEX idx_prediction_comments_prediction_id ON public.prediction_comments(prediction_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_telegram_sessions_user_id ON public.telegram_sessions(user_id);
CREATE INDEX idx_telegram_sessions_telegram_id ON public.telegram_sessions(telegram_id);
CREATE INDEX idx_telegram_sessions_expires_at ON public.telegram_sessions(expires_at);

-- Функция для автоматического создания профиля при регистрации через Telegram
CREATE OR REPLACE FUNCTION public.handle_new_telegram_user()
RETURNS TRIGGER AS $$
DECLARE
  telegram_user_data JSONB;
BEGIN
  -- Извлекаем данные Telegram из raw_user_meta_data
  telegram_user_data := NEW.raw_user_meta_data;
  
  -- Создаем профиль
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
  
  -- Создаем начальную статистику
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем триггер для автоматического создания профиля
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_telegram_user();

-- Функция для обновления статистики при изменении статуса прогноза
CREATE OR REPLACE FUNCTION public.update_user_stats_on_prediction_change()
RETURNS TRIGGER AS $$
DECLARE
    user_total_predictions INTEGER;
    user_successful INTEGER;
    user_failed INTEGER;
    user_pending INTEGER;
    user_total_stake NUMERIC;
    user_total_profit NUMERIC;
    user_total_loss NUMERIC;
    current_win_streak INTEGER;
    current_loss_streak INTEGER;
    best_win_streak INTEGER;
    best_loss_streak INTEGER;
    avg_coefficient NUMERIC;
    roi_calc NUMERIC;
    rating_change INTEGER := 0;
    exp_gained INTEGER := 0;
BEGIN
    -- Вычисляем общую статистику пользователя
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'win'),
        COUNT(*) FILTER (WHERE status = 'loss'),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COALESCE(SUM(stake), 0),
        COALESCE(SUM(CASE WHEN status = 'win' AND profit > 0 THEN profit ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN status = 'loss' AND profit < 0 THEN ABS(profit) ELSE 0 END), 0),
        COALESCE(AVG(coefficient), 0)
    INTO 
        user_total_predictions,
        user_successful,
        user_failed,
        user_pending,
        user_total_stake,
        user_total_profit,
        user_total_loss,
        avg_coefficient
    FROM public.predictions 
    WHERE user_id = NEW.user_id AND status IN ('win', 'loss', 'pending');

    -- Вычисляем ROI
    roi_calc := CASE 
        WHEN user_total_stake > 0 THEN ((user_total_profit - user_total_loss) / user_total_stake * 100)
        ELSE 0 
    END;

    -- Вычисляем текущие серии
    WITH recent_predictions AS (
        SELECT status, ROW_NUMBER() OVER (ORDER BY updated_at DESC) as rn
        FROM public.predictions 
        WHERE user_id = NEW.user_id AND status IN ('win', 'loss')
        ORDER BY updated_at DESC
        LIMIT 50
    )
    SELECT 
        CASE 
            WHEN (SELECT status FROM recent_predictions WHERE rn = 1) = 'win'
            THEN COUNT(*) FILTER (WHERE status = 'win')
            ELSE 0
        END,
        CASE 
            WHEN (SELECT status FROM recent_predictions WHERE rn = 1) = 'loss'
            THEN COUNT(*) FILTER (WHERE status = 'loss')
            ELSE 0
        END
    INTO current_win_streak, current_loss_streak
    FROM recent_predictions 
    WHERE rn <= COALESCE((
        SELECT MIN(rn) 
        FROM recent_predictions r2 
        WHERE r2.rn > 1 AND r2.status != (SELECT status FROM recent_predictions WHERE rn = 1)
    ), 50);

    -- Вычисляем лучшие серии (упрощенно)
    best_win_streak := GREATEST(current_win_streak, COALESCE((
        SELECT current_streak FROM public.user_stats WHERE user_id = NEW.user_id
    ), 0));
    
    best_loss_streak := GREATEST(current_loss_streak, COALESCE((
        SELECT current_loss_streak FROM public.user_stats WHERE user_id = NEW.user_id
    ), 0));

    -- Вычисляем изменение рейтинга и опыта
    IF OLD.status != NEW.status THEN
        CASE NEW.status
            WHEN 'win' THEN 
                rating_change := CASE 
                    WHEN NEW.coefficient >= 2.0 THEN 15
                    WHEN NEW.coefficient >= 1.5 THEN 10
                    ELSE 5
                END;
                exp_gained := CASE 
                    WHEN NEW.coefficient >= 2.0 THEN 25
                    WHEN NEW.coefficient >= 1.5 THEN 15
                    ELSE 10
                END;
            WHEN 'loss' THEN 
                rating_change := -8;
                exp_gained := 2;
            ELSE 
                rating_change := 0;
                exp_gained := 0;
        END CASE;
    END IF;

    -- Обновляем статистику пользователя
    UPDATE public.user_stats 
    SET 
        total_predictions = user_total_predictions,
        successful_predictions = user_successful,
        failed_predictions = user_failed,
        pending_predictions = user_pending,
        average_coefficient = ROUND(avg_coefficient, 2),
        total_stake = ROUND(user_total_stake, 2),
        total_profit = ROUND(user_total_profit, 2),
        total_loss = ROUND(user_total_loss, 2),
        roi = ROUND(roi_calc, 2),
        current_win_streak = current_win_streak,
        current_loss_streak = current_loss_streak,
        best_win_streak = best_win_streak,
        best_loss_streak = best_loss_streak,
        rating = GREATEST(0, rating + rating_change),
        experience_points = experience_points + exp_gained,
        level = LEAST(100, 1 + (experience_points + exp_gained) / 1000),
        last_calculated_at = NOW(),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для обновления статистики
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.predictions;
CREATE TRIGGER trigger_update_user_stats
    AFTER UPDATE OF status ON public.predictions
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_user_stats_on_prediction_change();

-- Функция для обновления счетчиков лайков
CREATE OR REPLACE FUNCTION public.update_prediction_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.predictions 
        SET likes_count = likes_count + 1,
            updated_at = NOW()
        WHERE id = NEW.prediction_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.predictions 
        SET likes_count = GREATEST(0, likes_count - 1),
            updated_at = NOW()
        WHERE id = OLD.prediction_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для лайков
CREATE TRIGGER trigger_prediction_likes_insert
    AFTER INSERT ON public.prediction_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_prediction_likes_count();

CREATE TRIGGER trigger_prediction_likes_delete
    AFTER DELETE ON public.prediction_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_prediction_likes_count();

-- Функция для обновления времени последней активности
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем триггер обновления времени к нужным таблицам
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
    BEFORE UPDATE ON public.predictions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prediction_comments_updated_at
    BEFORE UPDATE ON public.prediction_comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Функция для очистки истекших Telegram сессий
CREATE OR REPLACE FUNCTION public.cleanup_expired_telegram_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.telegram_sessions 
    WHERE expires_at < NOW() OR last_activity_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Вставляем начальные достижения
INSERT INTO public.achievements (title, description, icon_emoji, condition_type, condition_value, experience_points) VALUES
('Первый прогноз', 'Сделайте свой первый прогноз', '🎯', 'total_predictions', 1, 50),
('Дебютант', 'Сделайте 10 прогнозов', '📊', 'total_predictions', 10, 100),
('Активный игрок', 'Сделайте 50 прогнозов', '🔥', 'total_predictions', 50, 200),
('Опытный аналитик', 'Сделайте 100 прогнозов', '📈', 'total_predictions', 100, 300),
('Мастер прогнозов', 'Сделайте 500 прогнозов', '🏆', 'total_predictions', 500, 500),

('Первая победа', 'Выиграйте свой первый прогноз', '✅', 'successful_predictions', 1, 75),
('Уверенный старт', 'Выиграйте 5 прогнозов', '🎉', 'successful_predictions', 5, 125),
('На подъеме', 'Выиграйте 25 прогнозов', '📶', 'successful_predictions', 25, 250),
('Профессионал', 'Выиграйте 100 прогнозов', '💎', 'successful_predictions', 100, 400),

('Серия побед', 'Выиграйте 3 прогноза подряд', '🔥', 'current_win_streak', 3, 100),
('Горячая рука', 'Выиграйте 5 прогнозов подряд', '🌟', 'current_win_streak', 5, 200),
('Невероятная серия', 'Выиграйте 10 прогнозов подряд', '⭐', 'current_win_streak', 10, 500),

('Стабильность', 'Достигните ROI 10%', '💰', 'roi', 10, 150),
('Прибыльность', 'Достигните ROI 25%', '💸', 'roi', 25, 300),
('Финансовый гений', 'Достигните ROI 50%', '🏦', 'roi', 50, 600),

('Высокий рейтинг', 'Достигните рейтинга 1200', '📊', 'rating', 1200, 200),
('Элитный игрок', 'Достигните рейтинга 1500', '👑', 'rating', 1500, 400),
('Легенда', 'Достигните рейтинга 2000', '🏆', 'rating', 2000, 800);

-- Создание представлений для удобства
CREATE VIEW public.top_analysts AS
SELECT 
    p.user_id,
    pr.first_name,
    pr.last_name,
    pr.display_name,
    pr.avatar_url,
    pr.tier,
    us.total_predictions,
    us.successful_predictions,
    us.roi,
    us.rating,
    us.total_subscribers,
    ROUND(us.successful_predictions::decimal / NULLIF(us.total_predictions, 0) * 100, 2) as win_rate
FROM public.user_stats us
JOIN public.profiles pr ON pr.user_id = us.user_id
JOIN auth.users u ON u.id = us.user_id
LEFT JOIN public.predictions p ON p.user_id = us.user_id
WHERE us.total_predictions >= 10 
    AND pr.public_profile = true
    AND pr.role IN ('analyst', 'premium', 'vip')
GROUP BY p.user_id, pr.first_name, pr.last_name, pr.display_name, pr.avatar_url, pr.tier, us.total_predictions, us.successful_predictions, us.roi, us.rating, us.total_subscribers
ORDER BY us.rating DESC, us.roi DESC
LIMIT 100;