-- Создаем таблицу для челленджей
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('ladder', 'express', 'weekly', 'custom')),
    category TEXT,
    prize_pool NUMERIC DEFAULT 0,
    entry_fee NUMERIC DEFAULT 0,
    max_participants INTEGER,
    duration_hours INTEGER,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    min_coefficient NUMERIC,
    steps_count INTEGER,
    is_private BOOLEAN DEFAULT false,
    rules TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    participants_count INTEGER DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Включаем RLS для челленджей
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- Создаем политики для челленджей
CREATE POLICY "Публичные челленджи видны всем" 
ON public.challenges 
FOR SELECT 
USING (is_private = false OR auth.uid() = user_id);

CREATE POLICY "Пользователи могут создавать челленджи" 
ON public.challenges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свои челленджи" 
ON public.challenges 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Пользователи могут удалять свои челленджи" 
ON public.challenges 
FOR DELETE 
USING (auth.uid() = user_id);

-- Создаем таблицу для участников челленджей
CREATE TABLE public.challenge_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    current_step INTEGER DEFAULT 0,
    current_bank NUMERIC DEFAULT 0,
    is_eliminated BOOLEAN DEFAULT false,
    UNIQUE(challenge_id, user_id)
);

-- Включаем RLS для участников челленджей
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- Создаем политики для участников
CREATE POLICY "Участники челленджей видны всем" 
ON public.challenge_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Пользователи могут присоединяться к челленджам" 
ON public.challenge_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Пользователи могут обновлять свое участие" 
ON public.challenge_participants 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Создаем триггер для обновления updated_at в челленджах
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON public.challenges
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Создаем функцию для обновления количества участников
CREATE OR REPLACE FUNCTION public.update_challenge_participants_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.challenges 
        SET participants_count = participants_count + 1
        WHERE id = NEW.challenge_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.challenges 
        SET participants_count = GREATEST(0, participants_count - 1)
        WHERE id = OLD.challenge_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического обновления количества участников
CREATE TRIGGER update_participants_count_trigger
    AFTER INSERT OR DELETE ON public.challenge_participants
    FOR EACH ROW
    EXECUTE FUNCTION public.update_challenge_participants_count();