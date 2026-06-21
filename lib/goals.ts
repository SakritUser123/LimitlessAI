export interface UserGoals {
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
}

export const DEFAULT_GOALS: UserGoals = {
  target_calories: 2000,
  target_protein: 150,
  target_carbs: 250,
  target_fat: 65,
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return fallback;
}

export function normalizeGoals(value: unknown): UserGoals {
  const source = asRecord(value);

  return {
    target_calories: toNumber(source.target_calories, DEFAULT_GOALS.target_calories),
    target_protein: toNumber(source.target_protein, DEFAULT_GOALS.target_protein),
    target_carbs: toNumber(source.target_carbs, DEFAULT_GOALS.target_carbs),
    target_fat: toNumber(source.target_fat, DEFAULT_GOALS.target_fat),
  };
}

export function extractGoalsFromMetadata(privateMetadata: unknown, publicMetadata?: unknown): UserGoals {
  const privateData = asRecord(privateMetadata);
  const publicData = asRecord(publicMetadata);

  const nestedPrivate = privateData.nutritionGoals;
  const nestedPublic = publicData.nutritionGoals;

  const flatPrivate = {
    target_calories: privateData.target_calories,
    target_protein: privateData.target_protein,
    target_carbs: privateData.target_carbs,
    target_fat: privateData.target_fat,
  };

  const flatPublic = {
    target_calories: publicData.target_calories,
    target_protein: publicData.target_protein,
    target_carbs: publicData.target_carbs,
    target_fat: publicData.target_fat,
  };

  return normalizeGoals(
    Object.keys(asRecord(nestedPrivate)).length > 0
      ? nestedPrivate
      : Object.values(flatPrivate).some((value) => value != null)
        ? flatPrivate
        : Object.keys(asRecord(nestedPublic)).length > 0
          ? nestedPublic
          : flatPublic
  );
}
