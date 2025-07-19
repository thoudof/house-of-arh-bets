-- Create enums for roles and ranks
CREATE TYPE user_role AS ENUM ('user', 'analyst', 'moderator', 'admin', 'superadmin');
CREATE TYPE user_rank AS ENUM ('newbie', 'experienced', 'professional', 'expert', 'legend');
CREATE TYPE prediction_type AS ENUM ('single', 'express', 'system');
CREATE TYPE prediction_status AS ENUM ('pending', 'win', 'loss', 'returned');
CREATE TYPE challenge_type AS ENUM ('ladder', 'marathon');
CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'failed');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_id TEXT NOT NULL UNIQUE,
  username TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  rank user_rank DEFAULT 'newbie',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_stats table
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_predictions INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0.00,
  roi DECIMAL(8,2) DEFAULT 0.00,
  average_coefficient DECIMAL(8,2) DEFAULT 0.00,
  profit DECIMAL(12,2) DEFAULT 0.00,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  total_stake DECIMAL(12,2) DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analyst TEXT,
  event TEXT NOT NULL,
  type prediction_type NOT NULL,
  coefficient DECIMAL(8,2) NOT NULL,
  prediction TEXT NOT NULL,
  status prediction_status DEFAULT 'pending',
  stake DECIMAL(12,2),
  profit DECIMAL(12,2),
  time_left TEXT,
  category TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table (many-to-many)
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create challenges table
CREATE TABLE public.challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type challenge_type NOT NULL,
  title TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  start_bank DECIMAL(12,2) NOT NULL,
  current_bank DECIMAL(12,2) NOT NULL,
  status challenge_status DEFAULT 'active',
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create challenge_predictions table (many-to-many)
CREATE TABLE public.challenge_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  UNIQUE(challenge_id, prediction_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_predictions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_stats
CREATE POLICY "Users can view all stats" ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for predictions
CREATE POLICY "Users can view public predictions" ON public.predictions FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create own predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own predictions" ON public.predictions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own predictions" ON public.predictions FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for achievements
CREATE POLICY "Everyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view all user achievements" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for challenges
CREATE POLICY "Users can view all challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can update own challenges" ON public.challenges FOR UPDATE USING (auth.uid() = creator_id);

-- Create RLS policies for challenge_predictions
CREATE POLICY "Users can view challenge predictions" ON public.challenge_predictions FOR SELECT USING (true);
CREATE POLICY "Challenge creators can manage predictions" ON public.challenge_predictions FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.challenges 
    WHERE challenges.id = challenge_id AND challenges.creator_id = auth.uid()
  )
);

-- Create functions for automatic profile and stats creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  telegram_user_data JSONB;
BEGIN
  -- Extract Telegram user data from raw_user_meta_data
  telegram_user_data := NEW.raw_user_meta_data;
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, telegram_id, username, first_name, last_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(telegram_user_data ->> 'telegram_id', telegram_user_data ->> 'id'),
    telegram_user_data ->> 'username',
    COALESCE(telegram_user_data ->> 'first_name', 'User'),
    telegram_user_data ->> 'last_name',
    telegram_user_data ->> 'photo_url'
  );
  
  -- Insert initial stats
  INSERT INTO public.user_stats (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON public.predictions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default achievements
INSERT INTO public.achievements (title, description, icon, condition) VALUES
('Первый прогноз', 'Сделайте свой первый прогноз', '🎯', 'first_prediction'),
('Победная серия', 'Выиграйте 5 прогнозов подряд', '🔥', 'win_streak_5'),
('Аналитик', 'Сделайте 100 прогнозов', '📊', 'total_predictions_100'),
('Эксперт', 'Достигните винрейта 70%', '🏆', 'win_rate_70'),
('Профессионал', 'Заработайте 1000+ прибыли', '💰', 'profit_1000');