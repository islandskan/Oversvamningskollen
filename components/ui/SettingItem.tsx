import { View, Text } from 'react-native';
import { IconSymbol } from './IconSymbol';

export interface SettingItemProps {
  icon: string;
  title: string;
  description?: string;
  control: React.ReactNode;
}

export const SettingItem = ({ icon, title, description, control }: SettingItemProps) => (
  <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-3">
    <View className="w-10 h-10 rounded-full bg-modern-purple/10 items-center justify-center mr-3">
      <IconSymbol name={icon as any} size={20} color="#795de2" />
    </View>
    <View className="flex-1">
      <Text className="text-base font-medium text-gray-800 dark:text-gray-200">{title}</Text>
      {description && (
        <Text className="text-sm text-gray-500 dark:text-gray-400">{description}</Text>
      )}
    </View>
    {control}
  </View>
);