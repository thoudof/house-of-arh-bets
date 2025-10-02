-- Исправляем все функции, добавляя SET search_path = public для безопасности

-- 1. update_prediction_likes_count
CREATE OR REPLACE FUNCTION public.update_prediction_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.predictions 
        SET likes_count = likes_count + 1,
            updated_at = NOW()
        WHERE id = NEW.prediction_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.predictions 
        SET likes_count = GREATEST(0, likes_count - 1),
            updated_at = NOW()
        WHERE id = OLD.prediction_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

-- 2. update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 3. update_challenge_participants_count
CREATE OR REPLACE FUNCTION public.update_challenge_participants_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.challenges 
        SET participants_count = participants_count + 1
        WHERE id = NEW.challenge_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.challenges 
        SET participants_count = GREATEST(0, participants_count - 1)
        WHERE id = OLD.challenge_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$function$;

-- 4. cleanup_expired_telegram_sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_telegram_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    DELETE FROM public.telegram_sessions 
    WHERE expires_at < NOW() OR last_activity_at < NOW() - INTERVAL '30 days';
END;
$function$;

-- 5. check_auto_verification
CREATE OR REPLACE FUNCTION public.check_auto_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    user_likes_count INTEGER;
    user_predictions_count INTEGER;
    user_win_rate NUMERIC;
BEGIN
    SELECT 
        COALESCE(total_likes_received, 0),
        COALESCE(total_predictions, 0),
        CASE 
            WHEN total_predictions > 0 THEN (successful_predictions::NUMERIC / total_predictions::NUMERIC) * 100
            ELSE 0 
        END
    INTO user_likes_count, user_predictions_count, user_win_rate
    FROM public.user_stats 
    WHERE user_id = NEW.user_id;

    IF user_likes_count >= 50 AND user_predictions_count >= 20 AND user_win_rate >= 60.0 THEN
        UPDATE public.profiles 
        SET 
            is_verified = true,
            verification_date = NOW(),
            verification_type = 'auto'
        WHERE user_id = NEW.user_id AND is_verified = false;
    END IF;

    RETURN NEW;
END;
$function$;

-- 6. update_user_stats_on_prediction_change
CREATE OR REPLACE FUNCTION public.update_user_stats_on_prediction_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    user_total_predictions INTEGER;
    user_successful INTEGER;
    user_failed INTEGER;
    user_pending INTEGER;
    user_total_stake NUMERIC;
    user_total_profit NUMERIC;
    user_total_loss NUMERIC;
    current_win_streak INTEGER;
    current_loss_streak INTEGER;
    best_win_streak INTEGER;
    best_loss_streak INTEGER;
    avg_coefficient NUMERIC;
    roi_calc NUMERIC;
    rating_change INTEGER := 0;
    exp_gained INTEGER := 0;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'win'),
        COUNT(*) FILTER (WHERE status = 'loss'),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COALESCE(SUM(stake), 0),
        COALESCE(SUM(CASE WHEN status = 'win' AND profit > 0 THEN profit ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN status = 'loss' AND profit < 0 THEN ABS(profit) ELSE 0 END), 0),
        COALESCE(AVG(coefficient), 0)
    INTO 
        user_total_predictions,
        user_successful,
        user_failed,
        user_pending,
        user_total_stake,
        user_total_profit,
        user_total_loss,
        avg_coefficient
    FROM public.predictions 
    WHERE user_id = NEW.user_id AND status IN ('win', 'loss', 'pending');

    roi_calc := CASE 
        WHEN user_total_stake > 0 THEN ((user_total_profit - user_total_loss) / user_total_stake * 100)
        ELSE 0 
    END;

    WITH recent_predictions AS (
        SELECT status, ROW_NUMBER() OVER (ORDER BY updated_at DESC) as rn
        FROM public.predictions 
        WHERE user_id = NEW.user_id AND status IN ('win', 'loss')
        ORDER BY updated_at DESC
        LIMIT 50
    )
    SELECT 
        CASE 
            WHEN (SELECT status FROM recent_predictions WHERE rn = 1) = 'win'
            THEN COUNT(*) FILTER (WHERE status = 'win')
            ELSE 0
        END,
        CASE 
            WHEN (SELECT status FROM recent_predictions WHERE rn = 1) = 'loss'
            THEN COUNT(*) FILTER (WHERE status = 'loss')
            ELSE 0
        END
    INTO current_win_streak, current_loss_streak
    FROM recent_predictions 
    WHERE rn <= COALESCE((
        SELECT MIN(rn) 
        FROM recent_predictions r2 
        WHERE r2.rn > 1 AND r2.status != (SELECT status FROM recent_predictions WHERE rn = 1)
    ), 50);

    best_win_streak := GREATEST(current_win_streak, COALESCE((
        SELECT current_streak FROM public.user_stats WHERE user_id = NEW.user_id
    ), 0));
    
    best_loss_streak := GREATEST(current_loss_streak, COALESCE((
        SELECT current_loss_streak FROM public.user_stats WHERE user_id = NEW.user_id
    ), 0));

    IF OLD.status != NEW.status THEN
        CASE NEW.status
            WHEN 'win' THEN 
                rating_change := CASE 
                    WHEN NEW.coefficient >= 2.0 THEN 15
                    WHEN NEW.coefficient >= 1.5 THEN 10
                    ELSE 5
                END;
                exp_gained := CASE 
                    WHEN NEW.coefficient >= 2.0 THEN 25
                    WHEN NEW.coefficient >= 1.5 THEN 15
                    ELSE 10
                END;
            WHEN 'loss' THEN 
                rating_change := -8;
                exp_gained := 2;
            ELSE 
                rating_change := 0;
                exp_gained := 0;
        END CASE;
    END IF;

    UPDATE public.user_stats 
    SET 
        total_predictions = user_total_predictions,
        successful_predictions = user_successful,
        failed_predictions = user_failed,
        pending_predictions = user_pending,
        average_coefficient = ROUND(avg_coefficient, 2),
        total_stake = ROUND(user_total_stake, 2),
        total_profit = ROUND(user_total_profit, 2),
        total_loss = ROUND(user_total_loss, 2),
        roi = ROUND(roi_calc, 2),
        current_win_streak = current_win_streak,
        current_loss_streak = current_loss_streak,
        best_win_streak = best_win_streak,
        best_loss_streak = best_loss_streak,
        rating = GREATEST(0, rating + rating_change),
        experience_points = experience_points + exp_gained,
        level = LEAST(100, 1 + (experience_points + exp_gained) / 1000),
        last_calculated_at = NOW(),
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$function$;