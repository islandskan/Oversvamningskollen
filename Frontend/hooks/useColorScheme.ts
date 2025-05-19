import { useColorScheme as useDeviceColorScheme, Appearance } from 'react-native';
import { useState, useEffect } from 'react';

type ColorSchemeType = 'light' | 'dark' | null;

// Store the current theme preference
let currentThemePreference: ColorSchemeType = null;

// Create a list of subscribers to notify when the theme changes
const subscribers = new Set<(theme: string) => void>();

// Custom hook that extends the default useColorScheme
export function useColorScheme() {
  // Get the device color scheme
  const deviceColorScheme = useDeviceColorScheme();
  const [theme, setTheme] = useState<string>(currentThemePreference || deviceColorScheme || 'light');

  useEffect(() => {
    // Add this component to subscribers
    const updateTheme = (newTheme: string) => setTheme(newTheme);
    subscribers.add(updateTheme);

    // Clean up when component unmounts
    return () => {
      subscribers.delete(updateTheme);
    };
  }, []);

  return theme;
}

// Function to set the color scheme
export function setColorScheme(scheme: ColorSchemeType) {
  // Set the appearance for the entire app
  Appearance.setColorScheme(scheme);

  // Store the preference
  currentThemePreference = scheme;
  const finalTheme = scheme || useDeviceColorScheme() || 'light';

  // Notify all subscribers about the theme change
  subscribers.forEach(subscriber => subscriber(finalTheme));

  return finalTheme;
}
