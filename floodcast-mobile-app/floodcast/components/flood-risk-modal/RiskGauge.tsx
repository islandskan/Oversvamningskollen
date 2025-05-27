import { View, Text } from 'react-native';

interface RiskGaugeProps {
  riskLevel: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ riskLevel }) => {
  const getRiskPercentage = (level: string): string => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'high') return 'w-full';
    if (normalizedLevel === 'medium') return 'w-2/3';
    if (normalizedLevel === 'low') return 'w-1/3';
    return 'w-0';
  };

  const getBgColor = (level: string): string => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'high') return 'bg-red-500';
    if (normalizedLevel === 'medium') return 'bg-orange-500';
    if (normalizedLevel === 'low') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <View className="my-4">
      <View className="flex-row justify-between mb-1">
        <Text className="text-sm text-gray-700 dark:text-gray-300">Low Risk</Text>
        <Text className="text-sm text-gray-700 dark:text-gray-300">High Risk</Text>
      </View>
      <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <View
          className={`h-full ${getBgColor(riskLevel)} ${getRiskPercentage(riskLevel)}`}
        />
      </View>
    </View>
  );
};
