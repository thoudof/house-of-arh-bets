# 🎯 Telegram Mini App - Прогнозы

## 📋 Новая архитектура базы данных с Telegram авторизацией

Была создана полностью новая архитектура базы данных, оптимизированная для Telegram Mini Apps с автоматической авторизацией.

### 🏗 Основные таблицы:

1. **profiles** - Профили пользователей Telegram
2. **user_stats** - Детальная статистика пользователей  
3. **predictions** - Расширенная система прогнозов
4. **subscriptions** - Подписки на аналитиков
5. **prediction_likes** - Система лайков
6. **prediction_comments** - Комментарии к прогнозам
7. **notifications** - Уведомления пользователей
8. **achievements** - Система достижений
9. **user_achievements** - Прогресс пользователей
10. **telegram_sessions** - Сессии авторизации

### 🔐 Telegram авторизация

Реализована безопасная авторизация через Telegram Web Apps с:
- HMAC-SHA256 валидацией init data
- Автоматическим созданием профилей
- Управлением сессиями
- Поддержкой всех Telegram данных (username, photo_url, language_code)

### 📊 Новые возможности:

- **Система уровней**: Bronze, Silver, Gold, Platinum, Diamond
- **Рейтинговая система**: Динамический рейтинг с опытом
- **Расширенная аналитика**: ROI, серии побед/поражений
- **Социальные функции**: Подписки, лайки, комментарии
- **Уведомления**: Интеграция с Telegram Bot API
- **Представления**: Оптимизированные запросы (top_analysts)

### 🚀 Настройка Telegram бота:

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Добавьте токен в секреты проекта (кнопка ниже)
4. Настройте Web App URL в настройках бота

**Для работы авторизации необходимо добавить TELEGRAM_BOT_TOKEN:**

### 🔧 Техническая реализация:

- **Edge Function**: `telegram-auth` для валидации данных
- **RLS политики**: Безопасный доступ к данным
- **Триггеры**: Автоматическое обновление статистики
- **Индексы**: Оптимизация производительности
- **Функции**: Автоматические вычисления рейтинга и опыта

### 📱 Совместимость:

Архитектура полностью совместима с:
- Telegram Mini Apps
- Telegram Web Apps  
- Telegram Bot API
- Telegram SDK

## Project info

**URL**: https://lovable.dev/projects/9f6a3830-e488-44ef-836b-3d02c27038bc

## Установка зависимостей

```bash
npm install
```

## Запуск в режиме разработки

```bash
npm run dev
```

## Технологии проекта

- Vite + React + TypeScript
- Supabase (Database + Auth + Edge Functions)
- Telegram Mini Apps SDK
- shadcn-ui + Tailwind CSS

## Развертывание

Откройте [Lovable](https://lovable.dev/projects/9f6a3830-e488-44ef-836b-3d02c27038bc) и нажмите Share -> Publish.
