-- Добавляем только недостающие foreign key constraints
-- Сначала проверяем и добавляем только те, которых нет

-- Добавляем foreign key для prediction_likes (если не существует)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'prediction_likes_user_id_fkey') THEN
        ALTER TABLE public.prediction_likes
        ADD CONSTRAINT prediction_likes_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Добавляем foreign key для prediction_likes -> predictions
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'prediction_likes_prediction_id_fkey') THEN
        ALTER TABLE public.prediction_likes
        ADD CONSTRAINT prediction_likes_prediction_id_fkey
        FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Добавляем foreign key для prediction_comments
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'prediction_comments_user_id_fkey') THEN
        ALTER TABLE public.prediction_comments
        ADD CONSTRAINT prediction_comments_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'prediction_comments_prediction_id_fkey') THEN
        ALTER TABLE public.prediction_comments
        ADD CONSTRAINT prediction_comments_prediction_id_fkey
        FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Добавляем foreign key для notifications
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'notifications_user_id_fkey') THEN
        ALTER TABLE public.notifications
        ADD CONSTRAINT notifications_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                  WHERE constraint_name = 'notifications_prediction_id_fkey') THEN
        ALTER TABLE public.notifications
        ADD CONSTRAINT notifications_prediction_id_fkey
        FOREIGN KEY (prediction_id) REFERENCES public.predictions(id) ON DELETE CASCADE;
    END IF;
END $$;