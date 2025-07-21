-- Re-create basic tables to ensure they exist and types are generated correctly
-- This should resolve the TypeScript errors

-- Create enums if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('user', 'analyst', 'moderator', 'admin', 'superadmin');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_rank') THEN
    CREATE TYPE user_rank AS ENUM ('newbie', 'experienced', 'professional', 'expert', 'legend');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prediction_type') THEN
    CREATE TYPE prediction_type AS ENUM ('single', 'express', 'system');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prediction_status') THEN
    CREATE TYPE prediction_status AS ENUM ('pending', 'win', 'loss', 'cancelled');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_type') THEN
    CREATE TYPE challenge_type AS ENUM ('ladder', 'marathon');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'challenge_status') THEN
    CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'failed');
  END IF;
END
$$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
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

-- Create user_stats table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_stats (
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

-- Create predictions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.predictions (
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

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.challenges (
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

-- Create challenge_predictions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.challenge_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  UNIQUE(challenge_id, prediction_id)
);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.challenge_predictions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;

-- Create RLS policies if they don't exist
DO $$
BEGIN
  -- Profiles policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view all profiles' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- User stats policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view all stats' AND tablename = 'user_stats') THEN
    CREATE POLICY "Users can view all stats" ON public.user_stats FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own stats' AND tablename = 'user_stats') THEN
    CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own stats' AND tablename = 'user_stats') THEN
    CREATE POLICY "Users can insert own stats" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Predictions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view public predictions' AND tablename = 'predictions') THEN
    CREATE POLICY "Users can view public predictions" ON public.predictions FOR SELECT USING (is_public = true OR auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own predictions' AND tablename = 'predictions') THEN
    CREATE POLICY "Users can create own predictions" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own predictions' AND tablename = 'predictions') THEN
    CREATE POLICY "Users can update own predictions" ON public.predictions FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Achievements policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Everyone can view achievements' AND tablename = 'achievements') THEN
    CREATE POLICY "Everyone can view achievements" ON public.achievements FOR SELECT USING (true);
  END IF;

  -- User achievements policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view all user achievements' AND tablename = 'user_achievements') THEN
    CREATE POLICY "Users can view all user achievements" ON public.user_achievements FOR SELECT USING (true);
  END IF;

  -- Challenges policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view all challenges' AND tablename = 'challenges') THEN
    CREATE POLICY "Users can view all challenges" ON public.challenges FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create challenges' AND tablename = 'challenges') THEN
    CREATE POLICY "Users can create challenges" ON public.challenges FOR INSERT WITH CHECK (auth.uid() = creator_id);
  END IF;

  -- Challenge predictions policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view challenge predictions' AND tablename = 'challenge_predictions') THEN
    CREATE POLICY "Users can view challenge predictions" ON public.challenge_predictions FOR SELECT USING (true);
  END IF;

  -- Messages policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own messages' AND tablename = 'messages') THEN
    CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can send messages' AND tablename = 'messages') THEN
    CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
  END IF;
END
$$;