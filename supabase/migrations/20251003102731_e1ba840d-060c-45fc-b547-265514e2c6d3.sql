-- Fix telegram_sessions table RLS policies for better security
-- Sessions should only be accessible by their owners and managed by system functions

-- Drop existing policies
DROP POLICY IF EXISTS "Запрет доступа для анонимных" ON public.telegram_sessions;
DROP POLICY IF EXISTS "Только владелец сессии может прос" ON public.telegram_sessions;

-- Create RESTRICTIVE policy to block all anonymous access
CREATE POLICY "Блокировка анонимного доступа к сессиям"
ON public.telegram_sessions
AS RESTRICTIVE
FOR ALL
TO anon
USING (false);

-- Allow authenticated users to SELECT only their own sessions
CREATE POLICY "Пользователи видят только свои сессии"
ON public.telegram_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Block direct INSERT/UPDATE/DELETE from users
-- Sessions should only be managed through security definer functions
CREATE POLICY "Блокировка прямой модификации сессий"
ON public.telegram_sessions
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
  -- Allow SELECT (handled by separate policy above)
  CASE 
    WHEN current_setting('request.method', true) = 'GET' THEN true
    -- Block INSERT/UPDATE/DELETE from direct user access
    ELSE false
  END
);

-- Grant execute permissions on session management functions to authenticated users
GRANT EXECUTE ON FUNCTION public.create_telegram_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_session_activity TO authenticated;
GRANT EXECUTE ON FUNCTION public.deactivate_telegram_session TO authenticated;

-- Ensure cleanup function can run (service role)
GRANT EXECUTE ON FUNCTION public.cleanup_expired_telegram_sessions TO service_role;