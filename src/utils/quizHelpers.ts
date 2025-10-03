import type { TrainingModule, TrainingProgress } from '@/types/helperVerification';

export const canAttemptQuiz = (
  module: TrainingModule,
  progress?: TrainingProgress
): { canAttempt: boolean; reason?: string; retryAt?: string } => {
  if (!progress) {
    return { canAttempt: true };
  }

  // Check max attempts
  if (module.max_attempts && progress.attempts >= module.max_attempts) {
    return {
      canAttempt: false,
      reason: 'Maximum attempts reached. Contact an administrator for additional attempts.'
    };
  }

  // Check retry delay
  if (progress.can_retry_at) {
    const retryDate = new Date(progress.can_retry_at);
    const now = new Date();
    
    if (now < retryDate) {
      return {
        canAttempt: false,
        reason: `You must wait until ${formatRetryDate(retryDate)} before retrying this module.`,
        retryAt: progress.can_retry_at
      };
    }
  }

  return { canAttempt: true };
};

export const formatRetryDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300';
    case 'medium':
      return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300';
    case 'hard':
      return 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300';
    case 'very_hard':
      return 'bg-gradient-to-r from-[#4c3dfb] to-[#18a5fe] text-white border-transparent';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const getDifficultyLabel = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'Easy';
    case 'medium':
      return 'Medium';
    case 'hard':
      return 'Hard';
    case 'very_hard':
      return 'Very Hard';
    default:
      return 'Unknown';
  }
};

export const calculateTimeRemaining = (retryAt: string): string => {
  const retryDate = new Date(retryAt);
  const now = new Date();
  const diff = retryDate.getTime() - now.getTime();

  if (diff <= 0) return 'Available now';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
};

export const formatRetryMessage = (module: TrainingModule, progress: TrainingProgress): string => {
  const attemptsRemaining = module.max_attempts ? module.max_attempts - progress.attempts : null;
  
  if (progress.can_retry_at) {
    const timeRemaining = calculateTimeRemaining(progress.can_retry_at);
    return `Retry available in ${timeRemaining}`;
  }
  
  if (attemptsRemaining !== null && attemptsRemaining <= 0) {
    return 'No attempts remaining';
  }
  
  if (attemptsRemaining !== null && attemptsRemaining <= 2) {
    return `${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining`;
  }
  
  return '';
};
