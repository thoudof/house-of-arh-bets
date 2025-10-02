-- Исправляем критические уязвимости безопасности в telegram_sessions

-- Удаляем небезопасные политики
DROP POLICY IF EXISTS "Система может обновлять сессии" ON public.telegram_sessions;
DROP POLICY IF EXISTS "Система может создавать сессии" ON public.telegram_sessions;

-- Создаем безопасную функцию для создания сессии (только для edge functions)
CREATE OR REPLACE FUNCTION public.create_telegram_session(
  p_user_id uuid,
  p_telegram_id bigint,
  p_init_data_hash text,
  p_auth_date timestamp with time zone,
  p_expires_at timestamp with time zone,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_session_id uuid;
BEGIN
  -- Деактивируем старые сессии этого пользователя
  UPDATE public.telegram_sessions
  SET is_active = false
  WHERE user_id = p_user_id AND is_active = true;
  
  -- Создаем новую сессию
  INSERT INTO public.telegram_sessions (
    user_id,
    telegram_id,
    init_data_hash,
    auth_date,
    expires_at,
    ip_address,
    user_agent,
    is_active
  ) VALUES (
    p_user_id,
    p_telegram_id,
    p_init_data_hash,
    p_auth_date,
    p_expires_at,
    p_ip_address,
    p_user_agent,
    true
  )
  RETURNING id INTO v_session_id;
  
  RETURN v_session_id;
END;
$$;

-- Создаем безопасную функцию для обновления активности сессии
CREATE OR REPLACE FUNCTION public.update_session_activity(
  p_session_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Обновляем только если сессия принадлежит пользователю
  UPDATE public.telegram_sessions
  SET last_activity_at = NOW()
  WHERE id = p_session_id 
    AND user_id = p_user_id
    AND is_active = true
    AND expires_at > NOW();
  
  RETURN FOUND;
END;
$$;

-- Создаем безопасную функцию для деактивации сессии (logout)
CREATE OR REPLACE FUNCTION public.deactivate_telegram_session(
  p_session_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Деактивируем только если сессия принадлежит пользователю
  UPDATE public.telegram_sessions
  SET is_active = false
  WHERE id = p_session_id 
    AND user_id = p_user_id;
  
  RETURN FOUND;
END;
$$;

-- Комментарии для документации
COMMENT ON FUNCTION public.create_telegram_session IS 
'Безопасное создание Telegram сессии. Используется только из edge functions.';

COMMENT ON FUNCTION public.update_session_activity IS 
'Безопасное обновление времени активности сессии. Только для владельца сессии.';

COMMENT ON FUNCTION public.deactivate_telegram_session IS 
'Безопасная деактивация сессии при logout. Только для владельца сессии.';

-- Даем права на выполнение функций только аутентифицированным пользователям
GRANT EXECUTE ON FUNCTION public.create_telegram_session TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_session_activity TO authenticated;
GRANT EXECUTE ON FUNCTION public.deactivate_telegram_session TO authenticated;

-- Для edge functions даем права анонимным пользователям только на создание
GRANT EXECUTE ON FUNCTION public.create_telegram_session TO anon;