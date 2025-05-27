export const riskColors = {
  high: {
    bg: 'bg-red-500',
    text: 'text-red-600',
    mapFill: 'rgba(255, 0, 0, 0.2)',
    mapStroke: 'rgba(255, 0, 0, 0.5)'
  },
  medium: {
    bg: 'bg-orange-500',
    text: 'text-orange-600',
    mapFill: 'rgba(255, 165, 0, 0.2)',
    mapStroke: 'rgba(255, 165, 0, 0.5)'
  },
  low: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-600',
    mapFill: 'rgba(255, 204, 0, 0.2)',
    mapStroke: 'rgba(255, 204, 0, 0.5)'
  },
  default: {
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    mapFill: 'rgba(0, 0, 255, 0.2)',
    mapStroke: 'rgba(0, 0, 255, 0.5)'
  }
};

export type RiskStyleType = 'bg' | 'text' | 'mapFill' | 'mapStroke';

export const getRiskStyle = (riskLevel: string, type: RiskStyleType): string => {
  // Ensure riskLevel is lowercase to match our keys
  const normalizedLevel = riskLevel?.toLowerCase() as keyof typeof riskColors;

  // Check if the level exists in our colors object
  if (normalizedLevel && normalizedLevel in riskColors) {
    return riskColors[normalizedLevel][type];
  }

  // Fallback to default
  return riskColors.default[type];
};
