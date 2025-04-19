import { Switch, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useColorScheme, setColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const { logout } = useAuth();

  // state for theme toggle
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  // update the theme toggle when colorScheme changes
  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  }, [colorScheme]);

  // handle theme toggle
  const handleThemeToggle = (value: boolean) => {
    setIsDarkMode(value);
    setColorScheme(value ? 'dark' : 'light');
  };

  // handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      Alert.alert('Logout Failed', 'There was a problem logging out. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white dark:bg-gray-900">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">Settings</Text>
      </View>

      <View className="mb-6 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Preferences</Text>

        {/* theme Toggle */}
        <View className="flex-row justify-between items-center py-2">
          <Text className="text-base text-gray-800 dark:text-gray-200">Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={handleThemeToggle}
            trackColor={{ false: '#767577', true: '#0a7ea4' }}
            thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>

        <View className="flex-row justify-between items-center py-2">
          <Text className="text-base text-gray-800 dark:text-gray-200">Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#0a7ea4' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>

        <View className="flex-row justify-between items-center py-2">
          <Text className="text-base text-gray-800 dark:text-gray-200">Location Services</Text>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: '#767577', true: '#0a7ea4' }}
            thumbColor={locationEnabled ? '#ffffff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">About</Text>
        <Text className="text-base text-gray-800 dark:text-gray-200 mt-1">
          FloodCast v1.0.0
        </Text>
        <Text className="text-base text-gray-800 dark:text-gray-200 mt-1">
          Theme: {isDarkMode ? 'Dark' : 'Light'}
        </Text>
      </View>

      {/* add logout button at the bottom */}
      <View className="mt-8">
        <TouchableOpacity
          className="bg-red-600 py-3 rounded-lg items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold text-base">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
