-- Исправляем критическую уязвимость - telegram_sessions не должна быть доступна анонимным пользователям

-- Удаляем политику, которая дает доступ роли public (включая анонимных)
DROP POLICY IF EXISTS "Пользователи видят свои сессии" ON public.telegram_sessions;

-- Создаем политику ТОЛЬКО для аутентифицированных пользователей
CREATE POLICY "Только владелец сессии может просматривать"
ON public.telegram_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Явно запрещаем любые операции для анонимных пользователей
-- (хотя отсутствие политик и так запрещает доступ, это делает намерение явным)
CREATE POLICY "Запрет доступа для анонимных"
ON public.telegram_sessions
FOR ALL
TO anon
USING (false);

-- Убеждаемся, что нет других политик INSERT/UPDATE/DELETE
-- которые могли бы позволить несанкционированный доступ
DROP POLICY IF EXISTS "Пользователи могут создавать сессии" ON public.telegram_sessions;
DROP POLICY IF EXISTS "Пользователи могут обновлять сессии" ON public.telegram_sessions;

-- Комментарии для документации
COMMENT ON POLICY "Только владелец сессии может просматривать" ON public.telegram_sessions IS 
'БЕЗОПАСНОСТЬ: Только аутентифицированные пользователи могут видеть СВОИ сессии. Анонимный доступ полностью запрещен.';

COMMENT ON POLICY "Запрет доступа для анонимных" ON public.telegram_sessions IS 
'БЕЗОПАСНОСТЬ: Явный запрет всех операций для анонимных пользователей для защиты аутентификационных данных.';

-- Добавляем индекс для безопасного и быстрого поиска
CREATE INDEX IF NOT EXISTS idx_telegram_sessions_user_id 
ON public.telegram_sessions(user_id) 
WHERE is_active = true;

-- Комментарий к таблице
COMMENT ON TABLE public.telegram_sessions IS 
'КРИТИЧЕСКАЯ БЕЗОПАСНОСТЬ: Содержит чувствительные аутентификационные данные. Доступ строго ограничен владельцами сессий. Управление только через security definer функции.';