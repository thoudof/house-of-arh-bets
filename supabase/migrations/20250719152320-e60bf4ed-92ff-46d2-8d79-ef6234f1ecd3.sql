-- Create function to update user stats when prediction status changes
CREATE OR REPLACE FUNCTION public.update_user_stats_on_prediction_change()
RETURNS TRIGGER AS $$
DECLARE
    user_total_predictions INTEGER;
    user_wins INTEGER;
    user_total_stake NUMERIC;
    user_total_profit NUMERIC;
    current_win_streak INTEGER;
    best_win_streak INTEGER;
    avg_coefficient NUMERIC;
    win_rate_calc NUMERIC;
    roi_calc NUMERIC;
BEGIN
    -- Calculate stats from all user predictions
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'win'),
        COALESCE(SUM(stake), 0),
        COALESCE(SUM(profit), 0),
        COALESCE(AVG(coefficient), 0)
    INTO 
        user_total_predictions,
        user_wins,
        user_total_stake,
        user_total_profit,
        avg_coefficient
    FROM public.predictions 
    WHERE user_id = NEW.user_id AND status IN ('win', 'loss');

    -- Calculate win rate
    win_rate_calc := CASE 
        WHEN user_total_predictions > 0 THEN (user_wins::NUMERIC / user_total_predictions * 100)
        ELSE 0 
    END;

    -- Calculate ROI
    roi_calc := CASE 
        WHEN user_total_stake > 0 THEN (user_total_profit / user_total_stake * 100)
        ELSE 0 
    END;

    -- Calculate current streak
    WITH recent_predictions AS (
        SELECT status, ROW_NUMBER() OVER (ORDER BY updated_at DESC) as rn
        FROM public.predictions 
        WHERE user_id = NEW.user_id AND status IN ('win', 'loss')
        ORDER BY updated_at DESC
    ),
    streak_calc AS (
        SELECT 
            CASE 
                WHEN LAG(status) OVER (ORDER BY rn) != status OR LAG(status) OVER (ORDER BY rn) IS NULL 
                THEN 1 
                ELSE 0 
            END as streak_break,
            status,
            rn
        FROM recent_predictions
    )
    SELECT 
        CASE 
            WHEN (SELECT status FROM recent_predictions WHERE rn = 1) = 'win'
            THEN COUNT(*)
            ELSE 0
        END
    INTO current_win_streak
    FROM streak_calc 
    WHERE rn <= (
        SELECT COALESCE(MIN(rn), 1) 
        FROM streak_calc 
        WHERE streak_break = 1 AND rn > 1
    ) AND status = 'win';

    -- Calculate best streak
    WITH prediction_sequences AS (
        SELECT 
            status,
            updated_at,
            ROW_NUMBER() OVER (ORDER BY updated_at) - 
            ROW_NUMBER() OVER (PARTITION BY status ORDER BY updated_at) as grp
        FROM public.predictions 
        WHERE user_id = NEW.user_id AND status IN ('win', 'loss')
    )
    SELECT COALESCE(MAX(win_count), 0)
    INTO best_win_streak
    FROM (
        SELECT COUNT(*) as win_count
        FROM prediction_sequences 
        WHERE status = 'win'
        GROUP BY grp
    ) t;

    -- Update user stats
    UPDATE public.user_stats 
    SET 
        total_predictions = user_total_predictions,
        win_rate = ROUND(win_rate_calc, 2),
        roi = ROUND(roi_calc, 2),
        average_coefficient = ROUND(avg_coefficient, 2),
        profit = ROUND(user_total_profit, 2),
        current_streak = current_win_streak,
        best_streak = GREATEST(best_win_streak, current_streak),
        total_stake = ROUND(user_total_stake, 2),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update stats when prediction status changes
DROP TRIGGER IF EXISTS trigger_update_user_stats ON public.predictions;
CREATE TRIGGER trigger_update_user_stats
    AFTER UPDATE OF status ON public.predictions
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.update_user_stats_on_prediction_change();