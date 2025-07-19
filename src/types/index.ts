export interface User {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName?: string;
  avatar?: string;
  role: 'user' | 'analyst' | 'moderator' | 'admin' | 'superadmin';
  rank: 'newbie' | 'experienced' | 'professional' | 'expert' | 'legend';
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
  type: 'single' | 'express' | 'system';
  coefficient: number;
  prediction: string;
  status: 'pending' | 'win' | 'loss' | 'returned';
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
  type: 'ladder' | 'marathon';
  title: string;
  creatorId: string;
  creator: string;
  startBank: number;
  currentBank: number;
  status: 'active' | 'completed' | 'failed';
  currentStep: number;
  totalSteps?: number;
  predictions: Prediction[];
  startDate: string;
  endDate?: string;
}