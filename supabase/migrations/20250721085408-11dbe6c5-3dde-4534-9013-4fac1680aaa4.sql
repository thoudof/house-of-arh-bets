-- Удаляем все RLS политики
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view all stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;

DROP POLICY IF EXISTS "Users can view public predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can create own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can update own predictions" ON public.predictions;
DROP POLICY IF EXISTS "Users can delete own predictions" ON public.predictions;

DROP POLICY IF EXISTS "Users can view all challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can create challenges" ON public.challenges;
DROP POLICY IF EXISTS "Users can update own challenges" ON public.challenges;

DROP POLICY IF EXISTS "Users can view challenge predictions" ON public.challenge_predictions;
DROP POLICY IF EXISTS "Challenge creators can manage predictions" ON public.challenge_predictions;

DROP POLICY IF EXISTS "Everyone can view achievements" ON public.achievements;
DROP POLICY IF EXISTS "Users can view all user achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;

-- Отключаем RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_predictions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements DISABLE ROW LEVEL SECURITY;

-- Удаляем триггер создания пользователей
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Создаем простые политики для всех (без аутентификации)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "Allow all operations" ON public.user_stats FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.predictions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.challenges FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.challenge_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.challenge_predictions FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);

-- Убираем ссылки на auth.users из таблиц
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE public.user_stats DROP CONSTRAINT IF EXISTS user_stats_user_id_fkey;

-- Изменяем структуру таблиц - делаем user_id обычным UUID без ссылок на auth
-- profiles уже правильно настроена
-- user_stats тоже

-- Добавляем тестового пользователя
INSERT INTO public.profiles (
    id, user_id, telegram_id, first_name, username, language_code
) VALUES (
    gen_random_uuid(), 
    gen_random_uuid(), 
    '286386622', 
    'Тестовый пользователь', 
    'test_user',
    'ru'
) ON CONFLICT (telegram_id) DO NOTHING;

-- Добавляем статистику для тестового пользователя
INSERT INTO public.user_stats (user_id) 
SELECT user_id FROM public.profiles WHERE telegram_id = '286386622'
ON CONFLICT (user_id) DO NOTHING;