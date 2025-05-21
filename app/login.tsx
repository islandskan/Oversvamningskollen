import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { showAlert } from '@/utils/alert';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Missing Information', 'Please enter both email and password', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Login screen: Attempting login with email:', email);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login failed:', error);
      // Error alert is already shown in AuthContext, no need to show it again here
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

          <TextInput
            placeholder="Email"
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            className={`${isDark ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-900'} rounded-xl px-4 py-3 mb-4`}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Email address input"
            accessibilityHint="Enter your email address to sign in"
            accessibilityRole="text"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            secureTextEntry
            className={`${isDark ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-900'} rounded-xl px-4 py-3 mb-4`}
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password input"
            accessibilityHint="Enter your password to sign in"
            accessibilityRole="text"
          />

          <TouchableOpacity
            className="rounded-xl overflow-hidden"
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityLabel="Sign in button"
            accessibilityHint="Tap to sign in with your email and password"
            accessibilityRole="button"
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





        <View className="flex-row justify-between w-full mt-6">
          <TouchableOpacity
            accessibilityLabel="Forgot Password"
            accessibilityHint="Tap to reset your password"
            accessibilityRole="link"
          >
            <Text className="text-purple-500">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/signup')}
            accessibilityLabel="Sign Up"
            accessibilityHint="Tap to create a new account"
            accessibilityRole="link"
          >
            <Text className="text-purple-500">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
