-- Пересоздаем views с SECURITY INVOKER для соблюдения RLS

-- Удаляем старые views
DROP VIEW IF EXISTS public.public_profiles CASCADE;
DROP VIEW IF EXISTS public.top_analysts CASCADE;

-- Создаем public_profiles view с SECURITY INVOKER
CREATE VIEW public.public_profiles
WITH (security_invoker=on)
AS
SELECT 
  user_id,
  first_name,
  display_name,
  avatar_url,
  bio,
  is_verified,
  verification_date,
  tier,
  last_active_at,
  created_at
FROM public.profiles
WHERE public_profile = true;

-- Создаем top_analysts view с SECURITY INVOKER
-- Используем только публичные профили и статистику
CREATE VIEW public.top_analysts
WITH (security_invoker=on)
AS
SELECT 
  p.user_id,
  p.first_name,
  p.last_name,
  p.display_name,
  p.avatar_url,
  p.tier,
  us.total_predictions,
  us.successful_predictions,
  us.roi,
  us.rating,
  us.total_subscribers,
  CASE 
    WHEN us.total_predictions > 0 THEN ROUND((us.successful_predictions::NUMERIC / us.total_predictions::NUMERIC) * 100, 2)
    ELSE 0
  END AS win_rate
FROM public.profiles p
JOIN public.user_stats us ON p.user_id = us.user_id
WHERE p.public_profile = true 
  AND us.total_predictions >= 10
ORDER BY us.rating DESC, us.roi DESC
LIMIT 100;

-- Даем права на чтение
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;
GRANT SELECT ON public.top_analysts TO authenticated;
GRANT SELECT ON public.top_analysts TO anon;

-- Комментарии
COMMENT ON VIEW public.public_profiles IS 'Безопасное представление профилей с SECURITY INVOKER, соблюдает RLS';
COMMENT ON VIEW public.top_analysts IS 'Топ аналитиков с SECURITY INVOKER, доступно только для публичных профилей';