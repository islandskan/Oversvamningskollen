# EAS Preview Builds Troubleshooting Guide

This guide addresses common issues you might encounter when creating, distributing, and testing preview builds with EAS.

## Build Issues

### Build Fails with "Invalid Credentials"

**Problem:** Your build fails with an error about invalid credentials.

**Solutions:**
1. Ensure you're logged in with the correct Expo account:
   ```bash
   eas whoami
   ```
2. If needed, log out and log back in:
   ```bash
   eas logout
   eas login
   ```
3. For iOS builds, verify your Apple Developer credentials:
   ```bash
   eas credentials:ios
   ```
4. For Android builds, check your keystore:
   ```bash
   eas credentials:android
   ```

### Build Fails with "Missing Provisioning Profile"

**Problem:** iOS build fails because of missing or invalid provisioning profile.

**Solutions:**
1. Create a new provisioning profile:
   ```bash
   eas device:create
   ```
2. Register your test devices:
   ```bash
   eas device:create
   ```
3. Rebuild with the new profile:
   ```bash
   eas build --profile preview-ios --platform ios
   ```

### Build Fails with Native Module Errors

**Problem:** Build fails with errors related to native modules.

**Solutions:**
1. Check that all native modules are compatible with your Expo SDK version
2. Ensure you've run `npx expo install` to get compatible versions
3. Check for any required native configuration in the module's documentation
4. Try rebuilding with the `--clear-cache` flag:
   ```bash
   eas build --profile preview --platform all --clear-cache
   ```

## Distribution Issues

### QR Code Not Working on Android

**Problem:** Scanning the QR code doesn't download or install the APK.

**Solutions:**
1. Ensure your device has internet access
2. Try opening the link manually in a browser
3. Check if your device allows installation from unknown sources:
   - Settings > Security > Install unknown apps
4. Try downloading directly from the EAS dashboard

### QR Code Not Working on iOS

**Problem:** Scanning the QR code doesn't install the app on iOS.

**Solutions:**
1. Verify your device's UDID is registered in your Apple Developer account
2. Check that the device is included in the provisioning profile used for the build
3. Try using TestFlight instead:
   ```bash
   eas submit --platform ios
   ```
4. If using an enterprise account, ensure the device trusts your enterprise certificate

### "App Not Available" Error

**Problem:** When scanning the QR code, you get an "App not available" error.

**Solutions:**
1. Verify the build completed successfully:
   ```bash
   eas build:list
   ```
2. Check if the build was archived or deleted
3. Try rebuilding the app:
   ```bash
   eas build --profile preview --platform all
   ```

## Update Issues

### Updates Not Appearing on Devices

**Problem:** You've pushed an update, but devices aren't receiving it.

**Solutions:**
1. Verify you pushed to the correct channel:
   ```bash
   eas update:list
   ```
2. Check that the runtime version matches:
   ```bash
   eas update --channel preview
   ```
3. Force quit and restart the app on the device
4. Check your app's update configuration:
   ```javascript
   import * as Updates from 'expo-updates';

   // In your app
   async function checkForUpdates() {
     try {
       const update = await Updates.checkForUpdateAsync();
       if (update.isAvailable) {
         await Updates.fetchUpdateAsync();
         await Updates.reloadAsync();
       }
     } catch (error) {
       console.error('Error checking for updates:', error);
     }
   }
   ```

### "Invalid Runtime Version" Error

**Problem:** Updates fail with "Invalid runtime version" error.

**Solutions:**
1. Check your app's runtime version policy in app.json:
   ```json
   {
     "expo": {
       "runtimeVersion": {
         "policy": "appVersion"
       }
     }
   }
   ```
2. Ensure you're targeting the correct runtime version:
   ```bash
   eas update --runtime-version 1.0.0
   ```
3. If needed, rebuild the app with a matching runtime version

## Installation Issues

### "App Not Installing" on Android

**Problem:** The APK downloads but fails to install.

**Solutions:**
1. Check for any error messages during installation
2. Ensure you have enough storage space on your device
3. Try uninstalling any previous version of the app
4. Verify the APK isn't corrupted by downloading it again

### "Unable to Install" on iOS

**Problem:** iOS shows "Unable to install" error.

**Solutions:**
1. Verify your device is registered in the provisioning profile
2. Check if you need to trust the developer in Settings:
   - Settings > General > Device Management > [Developer Name] > Trust
3. Ensure your device is running a compatible iOS version
4. Try rebooting your device

## Development Client Issues

### "Development Client Not Connected"

**Problem:** The development client shows "Not connected to development server".

**Solutions:**
1. Ensure your development server is running:
   ```bash
   npx expo start --dev-client
   ```
2. Check that your device and computer are on the same network
3. Try using a tunnel connection:
   ```bash
   npx expo start --dev-client --tunnel
   ```
4. Verify the development client is properly installed:
   ```bash
   npx expo install expo-dev-client
   ```

### "Unable to Load Bundle"

**Problem:** The app shows "Unable to load bundle" error.

**Solutions:**
1. Check your Metro bundler is running
2. Verify network connectivity between device and development machine
3. Try clearing the Metro cache:
   ```bash
   npx expo start --clear
   ```
4. Check for any JavaScript errors in your code

## Account and Permission Issues

### "Unauthorized" Errors

**Problem:** You get "Unauthorized" errors when running EAS commands.

**Solutions:**
1. Verify you're logged in:
   ```bash
   eas whoami
   ```
2. Check if you have the correct permissions for the project
3. Ensure your account has an active subscription if required
4. Try logging out and back in:
   ```bash
   eas logout
   eas login
   ```

### "Quota Exceeded" Errors

**Problem:** You get "Quota exceeded" errors when building.

**Solutions:**
1. Check your current usage in the Expo dashboard
2. Consider upgrading your plan if you've reached limits
3. Delete old builds to free up space:
   ```bash
   eas build:delete [BUILD_ID]
   ```
4. Contact Expo support if you believe there's an error

## Getting More Help

If you're still experiencing issues:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Search the [Expo forums](https://forums.expo.dev/)
3. Join the [Expo Discord](https://chat.expo.dev/)
4. File an issue on [GitHub](https://github.com/expo/expo/issues)
5. Contact [Expo support](https://expo.dev/support)
