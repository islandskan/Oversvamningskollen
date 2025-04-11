import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-gray-900">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-blue-600 dark:text-blue-400 text-base">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
