import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useColorScheme } from '@/Frontend/hooks/useColorScheme';
import { router } from 'expo-router';
import { useAuth } from '@/Frontend/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { googleLogo, facebookLogo } from '@/Frontend/constants/logos';

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <View className="flex-1 justify-center items-center px-6">
        {/* logo and title */}
        <View className="mb-10 items-center">
          <MaskedView
            maskElement={
              <Text className="text-5xl font-bold">
                FloodCast
              </Text>
            }
          >
            <LinearGradient
              colors={['#a855f7', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text className="text-5xl font-bold opacity-0">
                FloodCast
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor flood risks in your area
          </Text>
        </View>

        {/* login form */}
        <View className="w-full rounded-3xl p-6 shadow-lg overflow-hidden">
          <LinearGradient
            colors={isDark ? ['#1f2937', '#111827'] : ['#f9fafb', '#f3f4f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />
          
          {/* username input */}
          <TextInput
            placeholder="Username"
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            className={`${isDark ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-900'} rounded-xl px-4 py-3 mb-4`}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {/* password input */}
          <TextInput
            placeholder="Password"
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            secureTextEntry
            className={`${isDark ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-900'} rounded-xl px-4 py-3 mb-4`}
            value={password}
            onChangeText={setPassword}
          />

          {/* sign In button */}
          <TouchableOpacity 
            className="rounded-xl overflow-hidden"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#a855f7', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-3 px-4 items-center"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium text-lg">Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* or separator */}
        <View className="w-full flex-row items-center my-6">
          <View className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          <Text className={`mx-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>or</Text>
          <View className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
        </View>

        {/* OAuth buttons */}
        <View className="w-full">
          {/* Google Sign In */}
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-white py-3 rounded-xl shadow mb-4"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <SvgXml xml={googleLogo} width="18" height="18" />
            <Text className="ml-2 text-gray-800 font-medium">Continue with Google</Text>
          </TouchableOpacity>

          {/* Facebook Sign In */}
          <TouchableOpacity 
            className="flex-row items-center justify-center bg-blue-600 py-3 rounded-xl shadow"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <SvgXml xml={facebookLogo} width="18" height="18" />
            <Text className="ml-2 text-white font-medium">Continue with Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* bottom Links */}
        <View className="flex-row justify-between w-full mt-6">
          <TouchableOpacity>
            <Text className="text-purple-500">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-purple-500">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
