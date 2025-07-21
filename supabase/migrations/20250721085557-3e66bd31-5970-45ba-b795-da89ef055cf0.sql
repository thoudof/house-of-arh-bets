-- Обновляем enum'ы чтобы они соответствовали коду фронтенда
DROP TYPE IF EXISTS public.prediction_type CASCADE;
DROP TYPE IF EXISTS public.challenge_type CASCADE;
DROP TYPE IF EXISTS public.prediction_status CASCADE;

-- Создаем новые типы с правильными значениями
CREATE TYPE public.prediction_type AS ENUM ('single', 'express', 'system', 'sport', 'crypto', 'stock', 'other');
CREATE TYPE public.challenge_type AS ENUM ('ladder', 'marathon', 'bank_growth', 'win_streak', 'roi_challenge');
CREATE TYPE public.prediction_status AS ENUM ('pending', 'win', 'loss', 'cancelled', 'returned');

-- Обновляем колонки в таблицах
ALTER TABLE public.predictions ALTER COLUMN type TYPE public.prediction_type USING type::text::public.prediction_type;
ALTER TABLE public.challenges ALTER COLUMN type TYPE public.challenge_type USING type::text::public.challenge_type;
ALTER TABLE public.predictions ALTER COLUMN status TYPE public.prediction_status USING status::text::public.prediction_status;