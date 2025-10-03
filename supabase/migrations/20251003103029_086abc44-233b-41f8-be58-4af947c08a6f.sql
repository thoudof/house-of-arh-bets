-- Fix user_achievements table security
-- Prevent users from manipulating achievements directly

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Достижения пользователей видны вс" ON public.user_achievements;
DROP POLICY IF EXISTS "Система может давать достижения" ON public.user_achievements;
DROP POLICY IF EXISTS "Система может обновлять прогресс" ON public.user_achievements;

-- Allow users to view all achievements (for leaderboards, profiles, etc.)
CREATE POLICY "Пользователи могут просматривать достижения"
ON public.user_achievements
FOR SELECT
TO authenticated
USING (true);

-- Block all direct modifications from users
CREATE POLICY "Блокировка прямой модификации достижений"
ON public.user_achievements
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
  -- Only allow SELECT (handled by separate policy above)
  CASE 
    WHEN current_setting('request.method', true) = 'GET' THEN true
    ELSE false
  END
);

-- Create secure function to grant achievements
CREATE OR REPLACE FUNCTION public.grant_user_achievement(
  p_user_id UUID,
  p_achievement_id UUID
)
RETURNS public.user_achievements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_achievement RECORD;
  v_user_achievement RECORD;
BEGIN
  -- Verify achievement exists and is active
  SELECT * INTO v_achievement
  FROM public.achievements
  WHERE id = p_achievement_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Achievement not found or inactive';
  END IF;
  
  -- Check if user already has this achievement
  SELECT * INTO v_user_achievement
  FROM public.user_achievements
  WHERE user_id = p_user_id AND achievement_id = p_achievement_id;
  
  IF FOUND THEN
    -- Already exists, return it
    RETURN v_user_achievement;
  END IF;
  
  -- Create new achievement record
  INSERT INTO public.user_achievements (
    user_id,
    achievement_id,
    current_progress,
    is_completed,
    completed_at
  ) VALUES (
    p_user_id,
    p_achievement_id,
    0,
    false,
    NULL
  )
  RETURNING * INTO v_user_achievement;
  
  RETURN v_user_achievement;
END;
$$;

-- Create secure function to update achievement progress
CREATE OR REPLACE FUNCTION public.update_achievement_progress(
  p_user_id UUID,
  p_achievement_id UUID,
  p_progress_increment INTEGER DEFAULT 1
)
RETURNS public.user_achievements
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_achievement RECORD;
  v_user_achievement RECORD;
  v_new_progress INTEGER;
BEGIN
  -- Get achievement details
  SELECT * INTO v_achievement
  FROM public.achievements
  WHERE id = p_achievement_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Achievement not found or inactive';
  END IF;
  
  -- Get or create user achievement
  SELECT * INTO v_user_achievement
  FROM public.user_achievements
  WHERE user_id = p_user_id AND achievement_id = p_achievement_id;
  
  IF NOT FOUND THEN
    -- Create new record
    v_user_achievement := public.grant_user_achievement(p_user_id, p_achievement_id);
  END IF;
  
  -- Don't update if already completed
  IF v_user_achievement.is_completed THEN
    RETURN v_user_achievement;
  END IF;
  
  -- Calculate new progress
  v_new_progress := LEAST(
    v_user_achievement.current_progress + p_progress_increment,
    v_achievement.condition_value
  );
  
  -- Update progress
  UPDATE public.user_achievements
  SET 
    current_progress = v_new_progress,
    is_completed = (v_new_progress >= v_achievement.condition_value),
    completed_at = CASE 
      WHEN v_new_progress >= v_achievement.condition_value THEN NOW()
      ELSE completed_at
    END
  WHERE user_id = p_user_id AND achievement_id = p_achievement_id
  RETURNING * INTO v_user_achievement;
  
  -- If achievement just completed, award experience points
  IF v_user_achievement.is_completed AND v_user_achievement.completed_at IS NOT NULL THEN
    UPDATE public.user_stats
    SET experience_points = experience_points + v_achievement.experience_points
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN v_user_achievement;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.grant_user_achievement TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_achievement_progress TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_completed ON public.user_achievements(user_id, is_completed);