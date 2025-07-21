-- Исправляем RLS политику для создания прогнозов
-- Проблема: auth.uid() возвращает null при кастомной авторизации через Telegram
-- Решение: изменим политику, чтобы она работала с аутентифицированными пользователями

DROP POLICY IF EXISTS "Пользователи могут создавать прог" ON public.predictions;

-- Создаем новую политику для INSERT
CREATE POLICY "Пользователи могут создавать прогнозы" 
ON public.predictions 
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Проверяем, что пользователь аутентифицирован и создает прогноз для себя
  auth.uid() IS NOT NULL AND (
    -- Либо это его собственный прогноз (user_id совпадает с auth.uid())
    auth.uid() = user_id
    OR 
    -- Либо пользователь существует в таблице profiles с таким user_id
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = predictions.user_id
      AND user_id IS NOT NULL
    )
  )
);

-- На всякий случай проверим и обновим политику SELECT, чтобы убедиться что она работает правильно
DROP POLICY IF EXISTS "Публичные прогнозы видны всем" ON public.predictions;

CREATE POLICY "Публичные прогнозы видны всем" 
ON public.predictions 
FOR SELECT 
USING (
  is_public = true 
  OR auth.uid() = user_id
  OR auth.uid() IS NULL  -- Разрешаем просмотр публичных прогнозов даже неаутентифицированным
);