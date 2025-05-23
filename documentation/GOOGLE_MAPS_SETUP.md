# Google Maps API Setup Guide

This guide explains how to set up and secure your Google Maps API key for the FloodCast application.

## Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
4. Create an API key:
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" and select "API Key"
   - Copy the generated API key

## Adding the API Key to Your Project

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your API key:
   ```
   MAPS_API_KEY=your_google_maps_api_key_here
   ```

3. The app is already configured to use this environment variable through the `app.config.js` file.

## Securing Your API Key

For development, an unrestricted API key is fine. For production, you should restrict your API key:

### Android Restrictions

1. In the Google Cloud Console, go to the API key you created
2. Under "Application restrictions", select "Android apps"
3. Click "Add package name and fingerprint"
4. Add your app's package name: `com.floodcast.app`
5. Add your app's SHA-1 certificate fingerprint:
   - For development: Run `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - For production: Get this from your Google Play Console after uploading your app

### iOS Restrictions

1. In the Google Cloud Console, go to the API key you created
2. Under "Application restrictions", select "iOS apps"
3. Click "Add bundle ID"
4. Add your app's bundle identifier: `com.floodcast.app`

## Testing Your API Key

1. Start your app:
   ```bash
   npm start
   ```

2. Open the app on an iOS or Android device/simulator
3. The map should load correctly with your API key

## Troubleshooting

If the map doesn't load:

1. Check that your API key is correctly set in the `.env` file
2. Verify that you've enabled the correct APIs in the Google Cloud Console
3. For Android, make sure you're using the Google Maps provider:
   ```jsx
   <MapView provider={PROVIDER_GOOGLE} />
   ```
4. For iOS, check that the bundle identifier matches what you set in the Google Cloud Console
5. For Android, check that the package name and SHA-1 fingerprint match what you set in the Google Cloud Console

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Expo Google Maps Documentation](https://docs.expo.dev/versions/latest/sdk/map-view/)
