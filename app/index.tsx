import { Redirect } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // check if user is logged in
    const checkAuthStatus = async () => {
      try {
        // this is just temporary - we'll replace with real auth later
        const isLoggedIn = false; // flip to true to skip login screen
        
        setIsAuthenticated(isLoggedIn);
        setIsLoading(false);
      } catch (error) {
        console.error('auth check failed:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
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