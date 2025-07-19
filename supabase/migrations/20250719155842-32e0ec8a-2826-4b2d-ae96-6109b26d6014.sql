-- Устанавливаем роль администратора для нового пользователя
UPDATE profiles 
SET role = 'admin'
WHERE user_id = '2dcbed22-73bf-4543-8a24-32820efec493';