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

  return (
    <View className={`p-4 flex-row justify-between items-center ${getBgColor(riskLevel)}`}>
      <View className="flex-row items-center">
        <Text className="text-lg font-bold text-white mr-2">{title}</Text>
        {/* <View className="px-2 py-1 bg-white/20 rounded-full">
          <Text className="text-xs font-bold text-white uppercase">
            {getRiskLevelLabel(riskLevel)}
          </Text>
        </View> */}
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
