import { View, Text } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader = ({ title }: SectionHeaderProps) => (
  <View className="flex-row items-center mb-4">
    <View className="w-4 h-4 rounded-full bg-modern-purple mr-2" />
    <Text className="text-xl font-bold text-gray-900 dark:text-white">{title}</Text>
  </View>
);