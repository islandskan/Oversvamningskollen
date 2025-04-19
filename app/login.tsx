import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      await login(username, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('login failed:', error);
      // show error message here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-6 bg-white dark:bg-gray-900">
      <View className="flex-1 justify-center">
        {/* app logo/title */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-gray-900 dark:text-white">FloodCast</Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 mt-2">
            Monitor flood risks in your area
          </Text>
        </View>

        {/* login form */}
        <View className="mb-8">
          <TextInput
            className="h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Username"
            placeholderTextColor={isDark ? '#9BA1A6' : '#687076'}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            className="h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mt-6"
            placeholder="Password"
            placeholderTextColor={isDark ? '#9BA1A6' : '#687076'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="h-12 rounded-lg bg-blue-600 items-center justify-center mt-6"
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* divider */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
          <Text className="mx-4 text-gray-500 dark:text-gray-400">or</Text>
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
        </View>

        {/* social login options */}
        <View>
          <TouchableOpacity
            className="h-12 rounded-lg flex-row items-center justify-center border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <View className="w-6 h-6 mr-3 items-center justify-center">
              <Text style={{ color: '#4285F4' }}>G</Text>
            </View>
            <Text className="text-gray-900 dark:text-white font-medium">Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="h-12 rounded-lg flex-row items-center justify-center bg-[#1877F2] mt-8"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white font-bold text-xl mr-2">f</Text>
            <Text className="text-white font-medium">Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* forgot password / sign up */}
        <View className="flex-row justify-between mt-8">
          <TouchableOpacity>
            <Text className="text-blue-600 dark:text-blue-400">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-blue-600 dark:text-blue-400">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}




