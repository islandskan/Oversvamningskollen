import { Switch, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useColorScheme, setColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/ui/IconSymbol';

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

  interface SettingItemProps {
    icon: string;
    title: string;
    description?: string;
    control: React.ReactNode;
  }

  const SettingItem = ({ icon, title, description, control }: SettingItemProps) => (
    <View className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl mb-3">
      <View className="w-10 h-10 rounded-full bg-modern-purple/10 items-center justify-center mr-3">
        <IconSymbol name={icon as any} size={20} color={isDarkMode ? '#795de2' : '#795de2'} />
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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-4">
        <View className="mb-6 mt-2">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">Settings</Text>
        </View>

        <View className="mb-6">
          {/*  dot before section header */}
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 rounded-full bg-modern-purple mr-2" />
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Appearance</Text>
          </View>

          <SettingItem
            icon="gear"
            title="Dark Mode"
            description="Switch between light and dark theme"
            control={
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
                trackColor={{ false: '#767577', true: '#795de2' }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            }
          />
        </View>

        <View className="mb-6">
          {/* dot before section header */}
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 rounded-full bg-modern-purple mr-2" />
            <Text className="text-xl font-bold text-gray-900 dark:text-white">Notifications</Text>
          </View>

          <SettingItem
            icon="paperplane.fill"
            title="Push Notifications"
            description="Receive alerts about flood risks"
            control={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#795de2' }}
                thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            }
          />

          <SettingItem
            icon="location.fill"
            title="Location Services"
            description="Allow access to your location"
            control={
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#767577', true: '#795de2' }}
                thumbColor={locationEnabled ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            }
          />
        </View>

        <View className="mb-6">
          {/*  dot before section header */}
          <View className="flex-row items-center mb-4">
            <View className="w-4 h-4 rounded-full bg-modern-purple mr-2" />
            <Text className="text-xl font-bold text-gray-900 dark:text-white">About</Text>
          </View>
          
          <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <Text className="text-base text-gray-800 dark:text-gray-200 font-medium">
              FloodCast v1.0.0
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Current theme: {isDarkMode ? 'Dark' : 'Light'}
            </Text>
            <TouchableOpacity className="mt-3">
              <Text className="text-modern-purple">Check for updates</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* logout button with red gradient */}
        <View className="my-8">
          <TouchableOpacity
            className="rounded-xl overflow-hidden"
            onPress={handleLogout}
          >
            <LinearGradient
              colors={['#ef4444', '#b91c1c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 0.866 }} // 120 degrees in x,y coordinates
              className="py-3 px-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Log Out</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
