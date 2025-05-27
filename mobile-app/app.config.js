import 'dotenv/config';

// Validate that the Maps API key is set
const mapsApiKey = process.env.MAPS_API_KEY;
if (!mapsApiKey) {
  console.warn('WARNING: MAPS_API_KEY is not set in .env file. Maps may not work correctly.');
}

export default {
  name: "floodcast",
  slug: "floodcast",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/floodcast-logo.png",
  splash: {
    image: "./assets/images/floodcast-logo.png",
    resizeMode: "cover",
    backgroundColor: "#101d2a"
  },
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/floodcast-192.png"
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.floodcast.app",
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false
    },
    config: {
      googleMapsApiKey: process.env.MAPS_API_KEY
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#101d2a"
    },
    package: "com.floodcast.app",
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION"
    ],
    config: {
      googleMaps: {
        apiKey: process.env.MAPS_API_KEY
      }
    }
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash.png",
        resizeMode: "cover",
        backgroundColor: "#101d2a"
      }
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: "Allow FloodCast to use your location to show nearby flood risks."
      }
    ],
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon-96.png",
        color: "#101d2a"
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: "fd631fd1-eadf-4299-ae85-1d055bed0dd4"
    }
  },
  runtimeVersion: "1.0.0",
  updates: {
    url: "https://u.expo.dev/fd631fd1-eadf-4299-ae85-1d055bed0dd4"
  },
  owner: "hemrys"
};
