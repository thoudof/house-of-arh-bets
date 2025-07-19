-- Удаляем пользователя и все связанные данные
-- Сначала удаляем данные из публичных таблиц
DELETE FROM user_achievements WHERE user_id = '012e7a6a-d569-40a8-9139-15c6863b643d';
DELETE FROM predictions WHERE user_id = '012e7a6a-d569-40a8-9139-15c6863b643d';
DELETE FROM user_stats WHERE user_id = '012e7a6a-d569-40a8-9139-15c6863b643d';
DELETE FROM profiles WHERE user_id = '012e7a6a-d569-40a8-9139-15c6863b643d';

-- Затем удаляем пользователя из auth.users (это автоматически удалит связанные данные)
DELETE FROM auth.users WHERE email = 'telegram_286386622@telegram.local';