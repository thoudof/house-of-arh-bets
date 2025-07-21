
-- Создаем тип user_role если он не существует
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем тип user_rank если он не существует
DO $$ BEGIN
    CREATE TYPE user_rank AS ENUM ('newbie', 'bronze', 'silver', 'gold', 'platinum', 'diamond');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем тип prediction_type если он не существует
DO $$ BEGIN
    CREATE TYPE prediction_type AS ENUM ('single', 'multiple', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем тип prediction_status если он не существует
DO $$ BEGIN
    CREATE TYPE prediction_status AS ENUM ('pending', 'win', 'loss', 'void');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем тип challenge_type если он не существует
DO $$ BEGIN
    CREATE TYPE challenge_type AS ENUM ('streak', 'profit', 'roi');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Создаем тип challenge_status если он не существует
DO $$ BEGIN
    CREATE TYPE challenge_status AS ENUM ('active', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
