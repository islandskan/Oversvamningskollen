import Constants from 'expo-constants';

// Get environment variables from app.config.js
const getEnvVars = () => {
  // For standalone apps (production) and Expo Go
  if (Constants.expoConfig) {
    const { ios, android } = Constants.expoConfig;

    return {
      mapsApiKey: {
        ios: ios?.config?.googleMapsApiKey || '',
        android: android?.config?.googleMaps?.apiKey || '',
      }
    };
  }

  // Fallback for development - should be empty strings
  // The actual keys should be in .env file and loaded via app.config.js
  return {
    mapsApiKey: {
      ios: '',
      android: '',
    }
  };
};

export default getEnvVars();
