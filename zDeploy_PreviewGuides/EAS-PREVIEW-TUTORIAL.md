# EAS Preview Builds Tutorial

This tutorial will walk you through the exact steps to create, publish, and test preview builds with QR codes for your FloodCast app.

## Prerequisites

- Make sure you're logged in to EAS CLI:
  ```bash
  eas login
  ```

## Step 1: Verify Your Configuration

We've already set up your `eas.json` file with the necessary configurations for preview builds. The key components are:

- `preview` profile that extends the development profile
- Platform-specific profiles for Android and iOS
- Update channels for preview and production builds

## Step 2: Prebuild Native Projects

Before creating builds, you need to prebuild the native projects for both platforms. This generates the necessary native code based on your JavaScript project and configuration.

```bash
# Prebuild for both platforms
npx expo prebuild

# Or prebuild for specific platforms
npx expo prebuild --platform android
npx expo prebuild --platform ios
```

This step is crucial as it generates the native iOS and Android projects that EAS Build will use.

## Step 3: Create Android Preview Build

After prebuilding, run the following command to create an Android preview build:

```bash
eas build --profile preview-android --platform android
```

This will start the build process for Android. The build will be an APK file that can be installed directly on Android devices.

During the build process, you'll see output in the terminal showing the progress. The build typically takes 10-15 minutes.

## Step 4: Create iOS Preview Build

After prebuilding, run the following command to create an iOS preview build:

```bash
eas build --profile preview-ios --platform ios
```

For iOS builds, you'll need to have:
- An Apple Developer account
- Registered devices in your Apple Developer account
- Proper provisioning profiles

The iOS build process will also take 10-15 minutes.

## Step 5: View Your Builds

Once the builds are complete, you can view them with:

```bash
eas build:list
```

This will show a list of your recent builds, including their status, platform, and ID.

## Step 6: Access the QR Codes

### Method 1: From the Command Line

To view a specific build and get its QR code:

```bash
eas build:view [BUILD_ID]
```

Replace `[BUILD_ID]` with the ID from the `eas build:list` command.

### Method 2: From the EAS Website

1. Go to [expo.dev](https://expo.dev)
2. Navigate to your project
3. Click on "Builds"
4. Find your preview build
5. Click on the QR code icon

## Step 7: Install the Preview Build

### On Android:

1. Scan the QR code with your device's camera
2. Tap the link to download the APK
3. Open the APK file to install (you may need to enable installation from unknown sources)
4. Open the app after installation

### On iOS:

1. Scan the QR code with your device's camera
2. If your device is registered in the provisioning profile, the app will install
3. If not, you'll need to register your device and rebuild

## Step 8: Push Updates to Your Preview Builds

After making changes to your app, you can push updates without rebuilding:

```bash
eas update --channel preview
```

This will bundle your JavaScript code and assets and make them available to all devices with the preview build installed.

## Step 9: Monitor Your Updates

You can view the status of your updates with:

```bash
eas update:list
```

This will show all your updates, including their status and the channel they were published to.

## Common Issues and Solutions

### Android Build Fails

If your Android build fails, check:
- Your Android keystore configuration
- Any native module compatibility issues
- Build logs for specific errors

```bash
eas build:view [BUILD_ID] --logs
```

### iOS Build Fails

If your iOS build fails, check:
- Your Apple Developer account credentials
- Provisioning profile and certificate setup
- Build logs for specific errors

```bash
eas build:view [BUILD_ID] --logs
```

### Updates Not Appearing

If updates aren't appearing on devices:
- Verify you're pushing to the correct channel
- Check that the app has internet connectivity
- Force quit and restart the app

## Next Steps

- Set up automated builds with GitHub Actions
- Configure background updates with expo-background-task
- Implement staged rollouts for your updates

## Resources

- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo Dev Client Documentation](https://docs.expo.dev/development/introduction/)
