import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  // show spinner while checking login status
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // send user to the right place based on login status
  return isAuthenticated ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
}