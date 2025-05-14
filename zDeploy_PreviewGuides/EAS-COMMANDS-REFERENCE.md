# EAS Commands Quick Reference

This document provides a quick reference for common EAS (Expo Application Services) commands used for creating, managing, and updating preview builds.

## Authentication

```bash
# Login to your Expo account
eas login

# Logout from your Expo account
eas logout

# View your current authentication status
eas whoami
```

## Project Configuration

```bash
# Initialize EAS in your project
eas build:configure

# Update your project configuration
eas update:configure
```

## Building Apps

```bash
# Build for Android with preview profile
eas build --profile preview-android --platform android

# Build for iOS with preview profile
eas build --profile preview-ios --platform ios

# Build for both platforms
eas build --profile preview --platform all

# Build with auto-submit to stores
eas build --profile production --platform all --auto-submit
```

## Managing Builds

```bash
# List all builds
eas build:list

# View a specific build
eas build:view [BUILD_ID]

# View build logs
eas build:view [BUILD_ID] --logs

# Cancel a build
eas build:cancel [BUILD_ID]
```

## Updates

```bash
# Push an update to the preview channel
eas update --channel preview

# Push an update to a specific branch
eas update --branch [BRANCH_NAME]

# Push an update with a message
eas update --message "Fixed login bug"

# List all updates
eas update:list

# View a specific update
eas update:view [UPDATE_ID]
```

## Credentials

```bash
# View your credentials
eas credentials

# Manage Android credentials
eas credentials:android

# Manage iOS credentials
eas credentials:ios
```

## Devices

```bash
# Register a device for iOS development
eas device:create

# List registered devices
eas device:list
```

## Submissions

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android

# List submissions
eas submit:list
```

## Webhooks

```bash
# Create a webhook
eas webhook:create

# List webhooks
eas webhook:list

# Update a webhook
eas webhook:update [WEBHOOK_ID]

# Delete a webhook
eas webhook:delete [WEBHOOK_ID]
```

## Advanced Commands

```bash
# Create a build with specific runtime version
eas build --profile preview --platform android --runtime-version 1.0.0

# Create a build with specific Android version code
eas build --profile preview --platform android --android-version-code 5

# Create a build with specific iOS build number
eas build --profile preview --platform ios --ios-build-number 5

# Push an update to a specific runtime version
eas update --runtime-version 1.0.0

# Force an update to be applied immediately
eas update --channel preview --force
```

## Environment Variables

```bash
# Set an environment variable
eas secret:create --name API_KEY --value your-api-key --scope project

# List environment variables
eas secret:list

# Delete an environment variable
eas secret:delete [SECRET_ID]
```

## Troubleshooting

```bash
# Check EAS CLI version
eas --version

# Get help for a specific command
eas build --help

# Diagnose common issues
eas diagnostics

# Clear EAS CLI cache
eas cache:clear
```

## Working with Channels

```bash
# Create a new channel
eas channel:create [CHANNEL_NAME]

# List all channels
eas channel:list

# View a specific channel
eas channel:view [CHANNEL_NAME]

# Delete a channel
eas channel:delete [CHANNEL_NAME]
```

## Working with Branches

```bash
# Create a new branch
eas branch:create [BRANCH_NAME]

# List all branches
eas branch:list

# View a specific branch
eas branch:view [BRANCH_NAME]

# Delete a branch
eas branch:delete [BRANCH_NAME]
```

## Additional Resources

- [EAS Documentation](https://docs.expo.dev/eas/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
