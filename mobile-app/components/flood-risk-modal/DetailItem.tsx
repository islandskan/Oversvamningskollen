import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colorScheme: string;
}

export const DetailItem: React.FC<DetailItemProps> = ({ 
  iconName, 
  label, 
  value, 
  colorScheme 
}) => {
  return (
    <View className="flex-row justify-between mb-1.5">
      <View className="flex-row items-center flex-1">
        <Ionicons
          name={iconName}
          size={16}
          color={colorScheme === 'dark' ? '#9ca3af' : '#4b5563'}
          style={{ marginRight: 6 }}
        />
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      </View>
      <Text className="text-sm text-gray-700 dark:text-gray-300 text-right flex-2">{value}</Text>
    </View>
  );
};
