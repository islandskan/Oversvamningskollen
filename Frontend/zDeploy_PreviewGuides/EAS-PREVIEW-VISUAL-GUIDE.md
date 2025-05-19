# EAS Preview Builds Visual Guide

This guide provides visual explanations of the EAS preview build process, including screenshots of each step.

## 1. Project Configuration
****
Your project is configured with the following files:

### eas.json
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

### app.json (relevant parts)
```json
{
  "expo": {
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/fd631fd1-eadf-4299-ae85-1d055bed0dd4"
    }
  }
}
```

## 2. Prebuilding Native Projects

Before creating builds, you need to generate the native iOS and Android projects:

Run the command:
```bash
npx expo prebuild
```

You'll see output similar to:

```
✔ Determined project type: expo
✔ Detected Android package: com.floodcast.app
✔ Detected iOS bundle identifier: com.floodcast.app
✔ Detected Expo config at app.json
✔ Generating native project files...
✔ Generated iOS project files
✔ Generated Android project files
✔ Your project is ready!
```

## 3. Building Preview Builds

### Starting an Android Build

After prebuilding, run the command:
```bash
eas build --profile preview-android --platform android
```

You'll see output similar to:

```
✔ Using remote Android credentials (Expo server)
✔ Using keystore from Expo server
✔ Using credentials from EAS servers
✔ Configured build for Android
✔ Compressed project files 123.4 MB (123,456,789 bytes)
✔ Uploaded to EAS
✔ Build started

⠏ Building...

Build details: https://expo.dev/accounts/your-account/projects/floodcast/builds/12345678-1234-1234-1234-123456789012
```

### Starting an iOS Build

After prebuilding, run the command:
```bash
eas build --profile preview-ios --platform ios
```

You'll see output similar to:

```
✔ Using credentials for @your-account
✔ Using iOS distribution certificate from Apple
✔ Using provisioning profile from Apple
✔ Configured build for iOS
✔ Compressed project files 123.4 MB (123,456,789 bytes)
✔ Uploaded to EAS
✔ Build started

⠏ Building...

Build details: https://expo.dev/accounts/your-account/projects/floodcast/builds/98765432-9876-9876-9876-987654321098
```

## 4. Viewing Builds on EAS Dashboard

After your build completes, you can view it on the EAS Dashboard:

1. Go to https://expo.dev
2. Navigate to your project
3. Click on "Builds" in the left sidebar
4. You'll see a list of your builds:

```
| Platform | Profile        | Status    | Created       | Version |
|----------|----------------|-----------|---------------|---------|
| Android  | preview-android| Completed | 5 minutes ago | 1.0.0   |
| iOS      | preview-ios    | Completed | 2 minutes ago | 1.0.0   |
```

## 5. Accessing QR Codes

### From the EAS Dashboard

1. Click on your completed build
2. Look for the QR code section:

```
┌─────────────────────┐
│ ▄▄▄▄▄ ▄  ▄▄▄ ▄▄▄▄▄ │
│ █   █ █ █   █   █ │
│ █▄▄▄█ █ █▄▄▄█▄▄▄█ │
│ █   █ █ █   █   █ │
│ █▄▄▄█ █ █▄▄▄█▄▄▄█ │
└─────────────────────┘
```

### From the Command Line

Run:
```bash
eas build:list
```

You'll see:
```
Android builds:
┌──────────────────────────────────┬─────────────┬────────────┬────────────────┐
│ ID                               │ Platform    │ Status     │ Created        │
├──────────────────────────────────┼─────────────┼────────────┼────────────────┤
│ 12345678-1234-1234-1234-12345678 │ ANDROID     │ COMPLETED  │ 5 minutes ago  │
└──────────────────────────────────┴─────────────┴────────────┴────────────────┘

iOS builds:
┌──────────────────────────────────┬─────────────┬────────────┬────────────────┐
│ ID                               │ Platform    │ Status     │ Created        │
├──────────────────────────────────┼─────────────┼────────────┼────────────────┤
│ 98765432-9876-9876-9876-98765432 │ IOS         │ COMPLETED  │ 2 minutes ago  │
└──────────────────────────────────┴─────────────┴────────────┴────────────────┘
```

Then run:
```bash
eas build:view 12345678-1234-1234-1234-12345678
```

This will open the build details in your browser, where you can find the QR code.

## 6. Installing the Preview Build

### Android Installation

1. Scan the QR code with your device's camera
2. Tap the link to download the APK
3. You'll see a download notification:
   ```
   Downloading floodcast-12345678.apk...
   ```
4. Open the APK file to install
5. You may see a security warning:
   ```
   Your phone is not allowed to install unknown apps from this source
   ```
6. Tap "Settings" and enable "Allow from this source"
7. Return to the installer and tap "Install"
8. Once installed, tap "Open" to launch the app

### iOS Installation

1. Scan the QR code with your device's camera
2. If your device is registered in the provisioning profile, you'll see:
   ```
   Would you like to install "FloodCast"?
   ```
3. Tap "Install"
4. The app will download and install
5. You may need to trust the developer in Settings:
   ```
   Settings > General > Device Management > [Developer Name] > Trust
   ```
6. Launch the app from your home screen

## 7. Pushing Updates

After making changes to your app, push an update:

```bash
eas update --channel preview
```

You'll see:
```
✔ Using runtime version policy: appVersion
✔ Using runtime version: 1.0.0
✔ Detected Expo SDK version
✔ Bundling assets and code for platform: android
✔ Bundling assets and code for platform: ios
✔ Uploading update
✔ Published update (ID: 12345678-1234-1234-1234-123456789012)

Update published successfully! Users on the preview channel with runtime version 1.0.0 will receive this update.
```

## 8. Viewing Updates

Run:
```bash
eas update:list
```

You'll see:
```
┌──────────────────────────────────┬─────────────┬────────────┬────────────────┐
│ ID                               │ Branch      │ Runtime    │ Created        │
├──────────────────────────────────┼─────────────┼────────────┼────────────────┤
│ 12345678-1234-1234-1234-12345678 │ preview     │ 1.0.0      │ 2 minutes ago  │
└──────────────────────────────────┴─────────────┴────────────┴────────────────┘
```

## 9. Testing the Update

1. Open the app on your device
2. The app will check for updates automatically
3. You'll see a loading indicator as it downloads the update
4. The app will reload with the new version

## 10. Verifying the Update

To verify which update is running:

1. In your app, add a version display component
2. Or check the EAS dashboard for active sessions
3. You can also add logging to confirm the update was applied
