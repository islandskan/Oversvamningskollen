# EAS Preview Builds with QR Codes Guide

This guide explains how to create and distribute preview builds of your Expo app using EAS (Expo Application Services). These builds can be installed on devices by scanning a QR code, making it easy to share test versions with your team or clients.

## Prerequisites

- An Expo project
- An Expo account
- EAS CLI installed (`npm install -g eas-cli`)
- Logged in to EAS CLI (`eas login`)

## 1. Configure Your Project

### Install Required Dependencies

```bash
npm install expo-dev-client expo-updates
```

### Configure EAS in your project

Your `eas.json` file should include configurations for preview builds. We've already set this up with:

```json
{
  "cli": {
    "version": ">= 16.3.3",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "extends": "development",
      "distribution": "internal",
      "channel": "preview"
    },
    "preview-android": {
      "extends": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "preview-ios": {
      "extends": "preview",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production"
    }
  },
  "submit": {
    "production": {}
  },
  "updates": {
    "preview": {
      "channel": "preview"
    },
    "production": {
      "channel": "production"
    }
  }
}
```

This configuration:
- Creates a `preview` profile that extends the development profile
- Sets up platform-specific profiles for Android and iOS
- Configures update channels for preview and production builds

## 2. Prebuild Native Projects

Before creating builds, you need to generate the native iOS and Android projects:

```bash
# Prebuild for both platforms
npx expo prebuild

# Or prebuild for specific platforms
npx expo prebuild --platform android
npx expo prebuild --platform ios
```

This step is crucial as it generates the native code that EAS Build will use. The prebuild process:
- Creates the iOS and Android native project directories
- Configures native dependencies based on your JavaScript project
- Sets up the necessary native code for your Expo modules

## 3. Create Preview Builds

### For Android

```bash
eas build --profile preview-android --platform android
```

This will:
1. Build an APK file that can be installed directly on Android devices
2. Use the development client for debugging capabilities
3. Set the distribution to "internal" so it's not publicly available
4. Associate the build with the "preview" update channel

### For iOS

```bash
eas build --profile preview-ios --platform ios
```

This will:
1. Build an IPA file that can be installed on iOS devices
2. Use the development client for debugging capabilities
3. Set the distribution to "internal" so it's not publicly available
4. Associate the build with the "preview" update channel

## 4. Access and Share QR Codes

After your build completes, you can access the QR code in several ways:

### Method 1: From the EAS Website

1. Go to [expo.dev](https://expo.dev)
2. Navigate to your project
3. Click on "Builds"
4. Find your preview build
5. Click on the QR code icon to view and share the QR code

### Method 2: From the Command Line

```bash
eas build:list
```

This will show your recent builds. Find the ID of your preview build, then run:

```bash
eas build:view [BUILD_ID]
```

This will open the build details in your browser, where you can find the QR code.

## 5. Install and Test the Preview Build

### On Android:

1. Scan the QR code with your device's camera
2. Tap the link to download the APK
3. Open the APK file to install (you may need to enable installation from unknown sources)
4. Open the app after installation

### On iOS:

iOS requires device registration before installation. There are two approaches:

#### Option A: Using Ad Hoc Distribution (recommended for teams)

1. Register your device's UDID in the Apple Developer Portal
2. Include the device in your provisioning profile
3. Rebuild the app with the updated profile
4. Scan the QR code to install

#### Option B: Using TestFlight (better for larger groups)

1. Build with `eas build --profile preview-ios --platform ios`
2. Submit to TestFlight with `eas submit --platform ios`
3. Invite testers via App Store Connect
4. Testers install via TestFlight app

## 6. Update Your Preview Builds Over-the-Air

Once users have installed your preview build, you can push updates without rebuilding:

```bash
eas update --channel preview
```

This will:
1. Bundle your JavaScript code and assets
2. Upload them to EAS
3. Make them available to all devices with the preview build installed

Users will receive the update the next time they open the app (or you can configure to check for updates in the background).

## Troubleshooting

### QR Code Not Working

- Ensure your device has internet access
- For iOS, verify the device is registered in your provisioning profile
- Try accessing the build directly from the EAS website

### Build Failing

- Check the build logs for specific errors
- Ensure your app.json/eas.json configurations are correct
- Verify your Apple Developer/Google Play credentials

### Updates Not Appearing

- Verify you're pushing to the correct channel
- Check that the app has internet connectivity
- Force quit and restart the app

## Additional Resources

- [Expo Dev Client Documentation](https://docs.expo.dev/development/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
