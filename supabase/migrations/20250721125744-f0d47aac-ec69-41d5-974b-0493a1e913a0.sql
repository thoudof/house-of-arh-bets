-- Исправляем проблемы безопасности с view top_analysts

-- Удаляем небезопасный view
DROP VIEW IF EXISTS public.top_analysts;

-- Создаем новый безопасный view без использования auth.users и без SECURITY DEFINER
CREATE VIEW public.top_analysts AS
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
    -- Вычисляем win_rate на основе имеющихся данных
    CASE 
        WHEN us.total_predictions > 0 
        THEN ROUND((us.successful_predictions::decimal / us.total_predictions * 100), 2)
        ELSE 0 
    END as win_rate
FROM public.profiles p
INNER JOIN public.user_stats us ON p.user_id = us.user_id
WHERE p.public_profile = true 
    AND us.total_predictions >= 10 
    AND p.role IN ('analyst', 'premium', 'vip')
ORDER BY us.rating DESC, us.roi DESC
LIMIT 100;

-- Создаем RLS политику для view (если необходимо)
ALTER VIEW public.top_analysts SET (security_invoker = true);

-- Добавляем комментарий для документации
COMMENT ON VIEW public.top_analysts IS 'Безопасный view топ-аналитиков, использующий только публичные таблицы без доступа к auth.users';