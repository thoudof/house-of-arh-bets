// Mock data for demo purposes when not in Telegram environment
export const DEMO_USER = {
  id: 'demo-user-id',
  telegram_id: 123456789,
  first_name: 'Дмитрий',
  last_name: 'Демонстрационный',
  username: 'demo_user',
  avatar_url: null
};

export const DEMO_PROFILE = {
  user_id: 'demo-user-id',
  telegram_id: 123456789,
  telegram_username: 'demo_user',
  first_name: 'Дмитрий',
  last_name: 'Демонстрационный',
  display_name: 'Дмитрий Демонстрационный',
  bio: 'Демонстрационный профиль для тестирования',
  avatar_url: null,
  is_verified: true,
  role: 'analyst' as const,
  tier: 'premium' as const,
  verification_type: 'manual',
  verification_date: new Date('2024-01-15').toISOString(),
  public_profile: true,
  notifications_enabled: true,
  auto_subscribe_enabled: false,
  timezone: 'Europe/Moscow',
  language_code: 'ru',
  last_active_at: new Date().toISOString(),
  created_at: new Date('2024-01-01').toISOString(),
  updated_at: new Date().toISOString()
};

export const DEMO_USER_STATS = {
  user_id: 'demo-user-id',
  total_predictions: 85,
  successful_predictions: 52,
  failed_predictions: 28,
  pending_predictions: 5,
  total_stake: 8500.00,
  total_profit: 2340.50,
  total_loss: 1820.00,
  roi: 27.5,
  rating: 1850,
  level: 12,
  experience_points: 11500,
  average_coefficient: 2.15,
  current_win_streak: 4,
  current_loss_streak: 0,
  best_win_streak: 8,
  best_loss_streak: 3,
  highest_coefficient: 4.85,
  total_likes_received: 245,
  total_likes_given: 156,
  total_subscribers: 89,
  total_subscriptions: 12,
  last_calculated_at: new Date().toISOString()
};

export const DEMO_PREDICTIONS = [
  {
    id: 'demo-prediction-1',
    user_id: 'demo-user-id',
    title: 'Реал Мадрид vs Барселона - Победа Реала',
    event_name: 'Эль Класико',
    description: 'Реал в отличной форме, играет дома. Барселона без ключевых игроков. Ставка на победу хозяев.',
    category: 'football' as const,
    type: 'single' as const,
    coefficient: 2.45,
    stake: 1000,
    profit: 1450,
    status: 'win' as const,
    event_start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    prediction_deadline: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
    result_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    result_note: 'Реал выиграл 2:1',
    is_public: true,
    is_premium: false,
    is_featured: true,
    views_count: 1250,
    likes_count: 89,
    comments_count: 23,
    shares_count: 45,
    competition_name: 'Ла Лига',
    league_name: 'Испания',
    tags: ['футбол', 'эль-класико', 'реал'],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'demo-prediction-2',
    user_id: 'demo-user-id',
    title: 'Манчестер Сити vs Ливерпуль - Тотал больше 2.5',
    event_name: 'Битва титанов',
    description: 'Два атакующих стиля игры. Ожидаю много голов в этом матче.',
    category: 'football' as const,
    type: 'single' as const,
    coefficient: 1.85,
    stake: 500,
    status: 'pending' as const,
    event_start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    prediction_deadline: new Date(Date.now() + 47 * 60 * 60 * 1000).toISOString(),
    is_public: true,
    is_premium: true,
    is_featured: false,
    views_count: 890,
    likes_count: 67,
    comments_count: 15,
    shares_count: 28,
    competition_name: 'Премьер-лига',
    league_name: 'Англия',
    tags: ['футбол', 'тотал', 'голы'],
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'demo-prediction-3',
    user_id: 'demo-user-id',
    title: 'Lakers vs Warriors - Победа Лейкерс',
    event_name: 'NBA Regular Season',
    description: 'Лейкерс показывают стабильную игру в последних матчах.',
    category: 'basketball' as const,
    type: 'single' as const,
    coefficient: 2.1,
    stake: 750,
    profit: -750,
    status: 'loss' as const,
    event_start_time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    prediction_deadline: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
    result_time: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    result_note: 'Warriors выиграли 118-112',
    is_public: true,
    is_premium: false,
    is_featured: false,
    views_count: 654,
    likes_count: 34,
    comments_count: 8,
    shares_count: 12,
    competition_name: 'NBA',
    league_name: 'США',
    tags: ['баскетбол', 'nba', 'лейкерс'],
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
  }
];

export const DEMO_TOP_ANALYSTS = [
  {
    user_id: 'demo-user-id',
    first_name: 'Дмитрий',
    last_name: 'Демонстрационный', 
    display_name: 'Дмитрий Демонстрационный',
    avatar_url: null,
    tier: 'premium' as const,
    rating: 1850,
    total_predictions: 85,
    successful_predictions: 52,
    win_rate: 61.2,
    roi: 27.5,
    total_subscribers: 89
  },
  {
    user_id: 'demo-analyst-2',
    first_name: 'Анна',
    last_name: 'Прогнозистка',
    display_name: 'Анна Прогнозистка',
    avatar_url: null,
    tier: 'telegram_premium' as const,
    rating: 1920,
    total_predictions: 132,
    successful_predictions: 89,
    win_rate: 67.4,
    roi: 31.8,
    total_subscribers: 156
  },
  {
    user_id: 'demo-analyst-3',
    first_name: 'Сергей',
    last_name: 'Спортэксперт',
    display_name: 'Сергей Спортэксперт',
    avatar_url: null,
    tier: 'platinum' as const,
    rating: 2100,
    total_predictions: 98,
    successful_predictions: 71,
    win_rate: 72.4,
    roi: 45.2,
    total_subscribers: 234
  }
];

export const DEMO_ACHIEVEMENTS = [
  {
    id: 'demo-achievement-1',
    title: 'Первый прогноз',
    description: 'Создайте свой первый прогноз',
    icon_emoji: '🎯',
    condition_type: 'predictions_count',
    condition_value: 1,
    experience_points: 100,
    tier_boost: 0,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-achievement-2',
    title: 'Опытный аналитик',
    description: 'Создайте 50 прогнозов',
    icon_emoji: '📊',
    condition_type: 'predictions_count',
    condition_value: 50,
    experience_points: 500,
    tier_boost: 1,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  }
];

// Функция для определения, находимся ли мы в demo режиме
export const isDemoMode = (): boolean => {
  // Проверяем, запущено ли приложение в Lovable (не в Telegram)
  return !window.Telegram?.WebApp?.initData;
};