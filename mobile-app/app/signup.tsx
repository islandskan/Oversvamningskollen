import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { showAlert } from '@/utils/alert';

export default function SignupScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      showAlert('Missing Information', 'Please enter your name', 'warning');
      return;
    }

    if (!email.trim()) {
      showAlert('Missing Information', 'Please enter your email', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showAlert('Invalid Email', 'Please enter a valid email address', 'warning');
      return;
    }

    if (!password || password.length < 6) {
      showAlert('Password Too Short', 'Password must be at least 6 characters', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      await register(name, email, password);
      showAlert('Registration Successful', 'Your account has been created. Please log in.', 'success');
      router.replace('/login');
    } catch (error) {
      console.error('Registration failed:', error);
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
                Join FloodCast
              </Text>
            }
          >
            <LinearGradient
              colors={['#a855f7', '#ec4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text className="text-5xl font-bold opacity-0">
                Join FloodCast
              </Text>
            </LinearGradient>
          </MaskedView>
          <Text className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor flood risks in your area
          </Text>
        </View>

        {/* signup form */}
        <View className="w-full rounded-3xl p-6 shadow-lg overflow-hidden">
          <LinearGradient
            colors={isDark ? ['#1f2937', '#111827'] : ['#f9fafb', '#f3f4f6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />

          {/* name input */}
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            className={`${isDark ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-900'} rounded-xl px-4 py-3 mb-4`}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          {/* email input */}
          <TextInput
            placeholder="Email"
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            className={`${isDark ? 'bg-gray-800/80 text-white' : 'bg-white/90 text-gray-900'} rounded-xl px-4 py-3 mb-4`}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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

          {/* sign up button */}
          <TouchableOpacity
            className="rounded-xl overflow-hidden"
            onPress={handleSignup}
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
                <Text className="text-white font-medium text-lg">Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>



        {/* bottom Links */}
        <View className="flex-row justify-center w-full mt-6">
          <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mr-1`}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text className="text-purple-500">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
