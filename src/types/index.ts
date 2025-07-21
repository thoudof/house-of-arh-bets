// Новые типы данных для обновленной архитектуры базы данных

export interface User {
  id: string;
  telegram_id: bigint;
  telegram_username?: string;
  first_name: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  role: 'user' | 'analyst' | 'premium' | 'vip' | 'admin';
  tier: 'free' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  language_code: string;
  timezone: string;
  notifications_enabled: boolean;
  auto_subscribe_enabled: boolean;
  public_profile: boolean;
  last_active_at: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_predictions: number;
  successful_predictions: number;
  failed_predictions: number;
  pending_predictions: number;
  average_coefficient: number;
  highest_coefficient: number;
  total_stake: number;
  total_profit: number;
  total_loss: number;
  roi: number;
  current_win_streak: number;
  current_loss_streak: number;
  best_win_streak: number;
  best_loss_streak: number;
  rating: number;
  level: number;
  experience_points: number;
  total_subscribers: number;
  total_subscriptions: number;
  total_likes_received: number;
  total_likes_given: number;
  last_calculated_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  event_name: string;
  type: 'single' | 'express' | 'system' | 'accumulator';
  category: 'football' | 'basketball' | 'tennis' | 'hockey' | 'esports' | 'other';
  coefficient: number;
  stake?: number;
  profit: number;
  status: 'pending' | 'win' | 'loss' | 'cancelled' | 'returned';
  result_note?: string;
  event_start_time: string;
  prediction_deadline?: string;
  result_time?: string;
  is_public: boolean;
  is_featured: boolean;
  is_premium: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  tags?: string[];
  league_name?: string;
  competition_name?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    role: string;
    tier: string;
    is_verified?: boolean;
  };
}

export interface PredictionWithProfile extends Prediction {
  profiles: {
    first_name: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    role: string;
    tier: string;
  } | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon_emoji: string;
  condition_type: string;
  condition_value: number;
  experience_points: number;
  tier_boost: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  current_progress: number;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  achievement?: Achievement;
}

export interface Subscription {
  id: string;
  subscriber_id: string;
  analyst_id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'season';
  notifications_enabled: boolean;
  auto_bet_enabled: boolean;
  max_auto_bet_amount: number;
  started_at: string;
  expires_at?: string;
  is_active: boolean;
  is_trial: boolean;
  created_at: string;
  updated_at: string;
}

export interface PredictionLike {
  id: string;
  user_id: string;
  prediction_id: string;
  created_at: string;
}

export interface PredictionComment {
  id: string;
  user_id: string;
  prediction_id: string;
  parent_comment_id?: string;
  content: string;
  likes_count: number;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'prediction' | 'result' | 'subscription' | 'achievement' | 'system';
  title: string;
  message: string;
  prediction_id?: string;
  from_user_id?: string;
  is_read: boolean;
  is_sent: boolean;
  telegram_message_id?: number;
  created_at: string;
  read_at?: string;
}

export interface TelegramSession {
  id: string;
  user_id: string;
  telegram_id: bigint;
  init_data_hash: string;
  auth_date: string;
  is_active: boolean;
  user_agent?: string;
  ip_address?: string;
  expires_at: string;
  last_activity_at: string;
  created_at: string;
}

// Типы данных для создания/обновления
export interface PredictionData {
  title: string;
  description?: string;
  event_name: string;
  type: 'single' | 'express' | 'system' | 'accumulator';
  category: 'football' | 'basketball' | 'tennis' | 'hockey' | 'esports' | 'other';
  coefficient: number;
  stake?: number;
  event_start_time: string;
  prediction_deadline?: string;
  is_public?: boolean;
  is_premium?: boolean;
  tags?: string[];
  league_name?: string;
  competition_name?: string;
}

export interface UserProfile {
  telegram_username?: string;
  display_name?: string;
  bio?: string;
  notifications_enabled?: boolean;
  auto_subscribe_enabled?: boolean;
  public_profile?: boolean;
  timezone?: string;
}

// Агрегированные типы для аналитики
export interface TopAnalyst {
  user_id: string;
  first_name: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  tier: string;
  total_predictions: number;
  successful_predictions: number;
  roi: number;
  rating: number;
  total_subscribers: number;
  win_rate: number;
}

// Legacy типы для обратной совместимости
export interface Challenge {
  id: string;
  type: 'ladder' | 'marathon';
  title: string;
  creator_id: string;
  creator_name: string;
  start_bank: number;
  current_bank: number;
  status: 'active' | 'completed' | 'failed';
  current_step: number;
  total_steps?: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

// Telegram Mini App типы
export interface TelegramInitData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export interface TelegramWebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  added_to_attachment_menu?: boolean;
  allows_write_to_pm?: boolean;
  photo_url?: string;
}