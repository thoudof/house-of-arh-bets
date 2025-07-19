-- УДАЛЯЕМ НАХУЙ ВСЕ
DELETE FROM user_achievements WHERE user_id = '2dcbed22-73bf-4543-8a24-32820efec493';
DELETE FROM predictions WHERE user_id = '2dcbed22-73bf-4543-8a24-32820efec493';
DELETE FROM user_stats WHERE user_id = '2dcbed22-73bf-4543-8a24-32820efec493';
DELETE FROM profiles WHERE user_id = '2dcbed22-73bf-4543-8a24-32820efec493';
DELETE FROM auth.users WHERE email = 'telegram_286386622@telegram.local';