import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface DetailSectionProps {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  colorScheme: string;
  children: React.ReactNode;
}

export const DetailSection: React.FC<DetailSectionProps> = ({ 
  title, 
  iconName, 
  colorScheme, 
  children 
}) => {
  return (
    <View className="mb-4">
      <View className="flex-row items-center mb-2">
        <Ionicons
          name={iconName}
          size={18}
          color={colorScheme === 'dark' ? '#e5e7eb' : '#1f2937'}
          style={{ marginRight: 6 }}
        />
        <Text className="text-base font-bold text-gray-800 dark:text-gray-200">{title}</Text>
      </View>
      {children}
    </View>
  );
};
