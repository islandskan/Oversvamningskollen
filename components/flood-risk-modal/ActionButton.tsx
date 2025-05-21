import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonProps {
  label: string;
  riskLevel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  riskLevel,
  iconName,
  onPress
}) => {
  const getButtonBgColor = (level: string): string => {
    const normalizedLevel = level.toLowerCase();
    if (normalizedLevel === 'high') return 'bg-red-600';
    if (normalizedLevel === 'medium') return 'bg-orange-600';
    if (normalizedLevel === 'low') return 'bg-yellow-600';
    return 'bg-blue-600';
  };

  return (
    <TouchableOpacity
      className={`mt-4 py-3 rounded-lg items-center ${getButtonBgColor(riskLevel)}`}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityHint={`Tap to ${label.toLowerCase()}`}
      accessibilityRole="button"
    >
      <View className="flex-row items-center">
        <Ionicons
          name={iconName}
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white font-medium">{label}</Text>
      </View>
    </TouchableOpacity>
  );
};
