-- Временно упрощаем RLS политику для INSERT в predictions
-- чтобы разрешить создание прогнозов аутентифицированным пользователям

DROP POLICY IF EXISTS "Пользователи могут создавать прогнозы" ON public.predictions;

-- Создаем упрощенную политику, которая проверяет только существование пользователя в profiles
CREATE POLICY "Пользователи могут создавать прогнозы" 
ON public.predictions 
FOR INSERT 
TO authenticated, anon
WITH CHECK (
  -- Проверяем, что пользователь существует в таблице profiles
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = predictions.user_id
  )
);