import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCalories(calories: number): string {
  return `${Math.round(calories)} kcal`;
}

export function formatMacro(value: number): string {
  return `${Math.round(value)}g`;
}

export function getCalorieColor(current: number, goal: number): string {
  const percentage = (current / goal) * 100;
  if (percentage < 80) return 'text-green-600';
  if (percentage < 100) return 'text-blue-600';
  if (percentage < 120) return 'text-orange-600';
  return 'text-red-600';
}

export function getMacroPercentage(macro: number, total: number): number {
  return Math.round((macro / total) * 100);
}

export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateBMI(weight: number, height: number): number {
  // height in cm, weight in kg
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

export function calculateTDEE(
  bmr: number,
  activityLevel: number
): number {
  // activityLevel: 1.2 (sedentary), 1.375 (light), 1.55 (moderate), 1.725 (very active), 1.9 (extreme)
  return Math.round(bmr * activityLevel);
}

export function calculateMacroRecommendation(
  calories: number,
  diet: 'balanced' | 'low-carb' | 'high-protein'
): {
  protein: number;
  carbs: number;
  fat: number;
} {
  switch (diet) {
    case 'low-carb':
      return {
        protein: Math.round(calories * 0.35) / 4, // 35% of calories, 4 cal/g
        carbs: Math.round(calories * 0.25) / 4, // 25% of calories
        fat: Math.round(calories * 0.4) / 9, // 40% of calories, 9 cal/g
      };
    case 'high-protein':
      return {
        protein: Math.round(calories * 0.4) / 4,
        carbs: Math.round(calories * 0.4) / 4,
        fat: Math.round(calories * 0.2) / 9,
      };
    default: // balanced
      return {
        protein: Math.round(calories * 0.3) / 4,
        carbs: Math.round(calories * 0.5) / 4,
        fat: Math.round(calories * 0.2) / 9,
      };
  }
}
