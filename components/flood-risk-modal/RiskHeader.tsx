import { View, Text, TouchableOpacity } from 'react-native';

interface RiskHeaderProps {
  title: string;
  riskLevel: string;
  onClose: () => void;
}

export const RiskHeader: React.FC<RiskHeaderProps> = ({ title, riskLevel, onClose }) => {
  const getBgColor = (level: string): string => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'high') return 'bg-red-500';
    if (normalizedLevel === 'medium') return 'bg-orange-500';
    if (normalizedLevel === 'low') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getRiskLevelLabel = (level: string): string => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'high') return 'High Risk';
    if (normalizedLevel === 'medium') return 'Medium Risk';
    if (normalizedLevel === 'low') return 'Low Risk';
    return 'Unknown Risk';
  };
   const getTextColor = (level: string): string => {
    const riskLevel = level.toLowerCase();
    if (riskLevel === 'high') return 'text-red-500';
    if (riskLevel === 'medium') return 'text-orange-500';
    if (riskLevel === 'low') return 'text-yellow-500';
    return 'text-blue-600';
  };

  return (
    <View className={`p-4 flex-row justify-between items-center ${getBgColor(riskLevel)}`}>
      <View className="flex-row items-center">
        {/* <Text className="text-2xl font-extrabold text-white mr-2 "></Text> */}
        <View className="px-2 py-1 bg-black/80 rounded-full">
          <Text className={`text-lg font-bold ${getTextColor(riskLevel)} uppercase`}>
            {getRiskLevelLabel(riskLevel)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={onClose}
        className="w-8 h-8 rounded-full bg-white/30 justify-center items-center"
        accessibilityLabel="Close flood risk details"
        accessibilityHint="Tap to close this flood risk information panel"
        accessibilityRole="button"
      >
        <Text className="text-base font-bold text-white">✕</Text>
      </TouchableOpacity>
    </View>
  );
};
