-- Добавляем отсутствующие foreign key constraints для правильной работы JOIN запросов

-- Добавляем foreign key для predictions -> profiles (через user_id)
ALTER TABLE public.predictions 
ADD CONSTRAINT predictions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Добавляем foreign key для user_stats -> profiles (через user_id)  
ALTER TABLE public.user_stats
ADD CONSTRAINT user_stats_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Добавляем foreign key для profiles -> auth.users
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Добавляем foreign key для notifications
ALTER TABLE public.notifications
ADD CONSTRAINT notifications_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_from_user_id_fkey
FOREIGN KEY (from_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_prediction_id_fkey
FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;

-- Добавляем foreign key для prediction_likes
ALTER TABLE public.prediction_likes
ADD CONSTRAINT prediction_likes_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.prediction_likes
ADD CONSTRAINT prediction_likes_prediction_id_fkey
FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;

-- Добавляем foreign key для prediction_comments
ALTER TABLE public.prediction_comments
ADD CONSTRAINT prediction_comments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.prediction_comments
ADD CONSTRAINT prediction_comments_prediction_id_fkey
FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;

ALTER TABLE public.prediction_comments
ADD CONSTRAINT prediction_comments_parent_comment_id_fkey
FOREIGN KEY (parent_comment_id) REFERENCES public.prediction_comments(id) ON DELETE CASCADE;

-- Добавляем foreign key для subscriptions
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_subscriber_id_fkey
FOREIGN KEY (subscriber_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_analyst_id_fkey
FOREIGN KEY (analyst_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Добавляем foreign key для user_achievements
ALTER TABLE public.user_achievements
ADD CONSTRAINT user_achievements_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_achievements
ADD CONSTRAINT user_achievements_achievement_id_fkey
FOREIGN KEY (achievement_id) REFERENCES public.achievements(id) ON DELETE CASCADE;

-- Добавляем foreign key для telegram_sessions
ALTER TABLE public.telegram_sessions
ADD CONSTRAINT telegram_sessions_user_id_fkey
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;