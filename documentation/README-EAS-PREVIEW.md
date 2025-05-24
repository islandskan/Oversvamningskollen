# EAS Preview Builds with QR Codes

This repository contains comprehensive documentation for creating, distributing, and testing preview builds of your FloodCast app using EAS (Expo Application Services).

## What Are Preview Builds?

Preview builds are development versions of your app that can be easily distributed to testers, stakeholders, or team members without going through the app stores. They include:

- Development tools for debugging
- Over-the-air update capabilities
- Easy distribution via QR codes
- The ability to test on real devices

## Documentation Overview

This repository includes the following documentation:

1. **[EAS-PREVIEW-GUIDE.md](./EAS-PREVIEW-GUIDE.md)** - A comprehensive guide to EAS preview builds
2. **[EAS-PREVIEW-TUTORIAL.md](./EAS-PREVIEW-TUTORIAL.md)** - Step-by-step tutorial with exact commands
3. **[EAS-PREVIEW-VISUAL-GUIDE.md](./EAS-PREVIEW-VISUAL-GUIDE.md)** - Visual guide with screenshots
4. **[EAS-COMMANDS-REFERENCE.md](./EAS-COMMANDS-REFERENCE.md)** - Quick reference for EAS commands
5. **[EAS-TROUBLESHOOTING-GUIDE.md](./EAS-TROUBLESHOOTING-GUIDE.md)** - Solutions for common issues

## Getting Started

If you're new to EAS preview builds, we recommend starting with the [EAS-PREVIEW-TUTORIAL.md](./EAS-PREVIEW-TUTORIAL.md) document, which provides a step-by-step walkthrough of the entire process.

## Prerequisites

Before you begin, make sure you have:

1. An Expo account
2. EAS CLI installed:
   ```bash
   npm install -g eas-cli
   ```
3. Logged in to EAS:
   ```bash
   eas login
   ```

## Quick Start

Here's a quick overview of the process:

1. **Configure your project**:
   - We've already set up your `eas.json` file with the necessary configurations
   - We've installed `expo-dev-client` for development capabilities

2. **Prebuild native projects**:
   ```bash
   # Prebuild for both platforms
   npx expo prebuild

   # Or prebuild for specific platforms
   npx expo prebuild --platform android
   npx expo prebuild --platform ios
   ```

3. **Create preview builds**:
   ```bash
   # For Android
   eas build --profile preview-android --platform android

   # For iOS
   eas build --profile preview-ios --platform ios
   ```

4. **Access QR codes**:
   ```bash
   # List builds
   eas build:list

   # View a specific build (includes QR code)
   eas build:view [BUILD_ID]
   ```

5. **Push updates**:
   ```bash
   # After making changes to your app
   eas update --channel preview
   ```

## Project Configuration

Your project is configured with:

- `eas.json` - Defines build profiles and update channels
- `app.json` - Configures runtime version policy and update URL
- `package.json` - Includes necessary dependencies like `expo-dev-client` and `expo-updates`

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [Expo Dev Client Documentation](https://docs.expo.dev/development/introduction/)

## Support

If you encounter any issues not covered in the troubleshooting guide, you can:

- Join the [Expo Discord](https://chat.expo.dev/)
- Post on the [Expo Forums](https://forums.expo.dev/)
- File an issue on [GitHub](https://github.com/expo/expo/issues)
- Contact [Expo Support](https://expo.dev/support)
