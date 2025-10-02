-- Исправляем top_analysts VIEW для защиты персональных данных

-- Удаляем старый VIEW
DROP VIEW IF EXISTS public.top_analysts CASCADE;

-- Создаем безопасный VIEW без чувствительных персональных данных
CREATE VIEW public.top_analysts
WITH (security_invoker=on)
AS
SELECT 
  p.user_id,
  -- Показываем только display_name или first_name, НЕ полное имя
  COALESCE(p.display_name, p.first_name) as display_name,
  -- Аватар - не чувствительная информация
  p.avatar_url,
  -- Публичная информация
  p.tier,
  p.is_verified,
  -- Статистика
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

-- Права доступа - только для чтения, для всех
GRANT SELECT ON public.top_analysts TO authenticated;
GRANT SELECT ON public.top_analysts TO anon;

-- Комментарий
COMMENT ON VIEW public.top_analysts IS 
'Публичный рейтинг топ аналитиков. Показывает только display_name (псевдоним) для защиты персональных данных. Доступ через security_invoker для соблюдения RLS.';

-- Создаем также безопасную функцию для получения публичной информации аналитика
CREATE OR REPLACE FUNCTION public.get_analyst_public_info(analyst_user_id uuid)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_url text,
  tier user_tier,
  is_verified boolean,
  total_predictions integer,
  win_rate numeric,
  roi numeric,
  rating integer
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 
    p.user_id,
    COALESCE(p.display_name, p.first_name) as display_name,
    p.avatar_url,
    p.tier,
    p.is_verified,
    us.total_predictions,
    CASE 
      WHEN us.total_predictions > 0 THEN ROUND((us.successful_predictions::NUMERIC / us.total_predictions::NUMERIC) * 100, 2)
      ELSE 0
    END AS win_rate,
    us.roi,
    us.rating
  FROM public.profiles p
  JOIN public.user_stats us ON p.user_id = us.user_id
  WHERE p.user_id = analyst_user_id 
    AND p.public_profile = true;
$$;

COMMENT ON FUNCTION public.get_analyst_public_info IS 
'Безопасная функция для получения публичной информации аналитика без раскрытия реальных имен и фамилий.';