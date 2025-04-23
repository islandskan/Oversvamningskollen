import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

// Google logo SVG
const googleLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  <path fill="none" d="M0 0h48v48H0z"/>
</svg>`;

// Facebook logo SVG
const facebookLogo = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
  <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127c-.82-.088-1.643-.13-2.467-.127-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"/>
</svg>`;

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
            className="bg-blue-600 py-3 rounded-xl items-center"
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium text-lg">Sign In</Text>
            )}
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
