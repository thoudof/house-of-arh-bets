-- Исправляем RLS политики для user_stats - защищаем финансовые данные

-- Удаляем старую небезопасную политику
DROP POLICY IF EXISTS "Статистика видна всем" ON public.user_stats;

-- Создаем безопасные политики для user_stats

-- 1. Пользователи всегда видят свою полную статистику
CREATE POLICY "Пользователи видят свою статистику"
ON public.user_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Анонимные и аутентифицированные пользователи видят статистику только для публичных профилей
CREATE POLICY "Публичная статистика видна всем"
ON public.user_stats
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.user_id = user_stats.user_id 
      AND profiles.public_profile = true
  )
);

-- Комментарии для документации
COMMENT ON POLICY "Пользователи видят свою статистику" ON public.user_stats IS 
'Аутентифицированные пользователи имеют полный доступ к своей статистике';

COMMENT ON POLICY "Публичная статистика видна всем" ON public.user_stats IS 
'Статистика доступна всем только если профиль пользователя публичный (public_profile = true)';