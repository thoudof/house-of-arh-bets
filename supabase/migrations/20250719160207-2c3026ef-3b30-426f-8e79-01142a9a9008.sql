-- Сбрасываем пароль для существующего пользователя на правильный
UPDATE auth.users 
SET encrypted_password = crypt('tg_286386622', gen_salt('bf'))
WHERE email = 'telegram_286386622@telegram.local';