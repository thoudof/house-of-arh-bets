
export interface User {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  rank: 'newbie' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  stats: UserStats;
  createdAt: string;
}

export interface UserStats {
  totalPredictions: number;
  winRate: number;
  roi: number;
  averageCoefficient: number;
  profit: number;
  currentStreak: number;
  bestStreak: number;
  totalStake: number;
}

export interface Prediction {
  id: string;
  userId: string;
  analyst?: string;
  event: string;
  type: 'single' | 'multiple' | 'system';
  coefficient: number;
  prediction: string;
  status: 'pending' | 'win' | 'loss' | 'void';
  stake?: number;
  profit?: number;
  timeLeft: string;
  category: string;
  description?: string;
  startDate: string;
  endDate?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface Challenge {
  id: string;
  type: 'streak' | 'profit' | 'roi';
  title: string;
  creatorId: string;
  creator: string;
  startBank: number;
  currentBank: number;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  totalSteps?: number;
  predictions: Prediction[];
  startDate: string;
  endDate?: string;
}
