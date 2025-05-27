**# EAS Update Preview QR Code Guide

This guide explains how to create EAS Update preview builds with QR codes for specific branches in your Expo/React Native project.
***
## Prerequisites

- Expo project with EAS configured
- EAS CLI installed (`npm install -g eas-cli`)
- Logged in to EAS (`eas login`)
- Project has `updates` configuration in `app.json`

## Basic Process

### 1. Check Your Configuration

Ensure your `app.json` has the proper updates configuration:

```json
{
  "expo": {
    // other config
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    }
  }
}
```

And your `eas.json` has appropriate build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

### 2. Create an EAS Update for Your Branch

Run the following command, explicitly specifying your branch name:

```bash
npx eas update --branch YOUR_BRANCH_NAME --message "Your update message"
```

Example:
```bash
npx eas update --branch feature-branch --message "Added new feature X"
```

This command:
- Bundles your JavaScript code
- Uploads assets
- Creates an update for the specified branch
- Generates a QR code URL

### 3. View Your Update

To see your update and get the QR code URL:

```bash
npx eas-cli update:list --branch YOUR_BRANCH_NAME
```

## Working with Branches Not in Selection Menu

When running `npx eas-cli update:list`, you might only see branches that already have updates. To work with a new branch:

1. **Always explicitly specify the branch name** when creating updates:
   ```bash
   npx eas update --branch new-branch-name --message "First update for this branch"
   ```

2. **After publishing** at least one update to a branch, it will appear in the selection menu.

## Creating a Build Compatible with Your Update

For your update to work, you need a compatible build installed on devices:

1. Create a build for the same branch:
   ```bash
   npx eas build --profile preview --platform all
   ```

2. Specify the branch during build (optional but recommended):
   ```bash
   npx eas build --profile preview --platform all --channel YOUR_BRANCH_NAME
   ```

## Sharing Your Update

There are two ways to share your update:

1. **QR Code from EAS Dashboard**:
   - Go to https://expo.dev
   - Navigate to your project → Updates → Your Branch
   - Find the QR code for the update

2. **Direct Link**:
   - Use the URL provided after running the update command
   - Format: `https://expo.dev/accounts/[ACCOUNT]/projects/[PROJECT]/updates/[UPDATE_ID]`

## Troubleshooting

### Update Not Showing on Device

- **Check compatibility**: Make sure the device has a build with matching:
  - `runtimeVersion`
  - Platform (iOS/Android)
  - Expo SDK version

- **Verify channel**: The installed app should be on the same channel/branch

### "No Compatible Builds Found" Warning

This warning appears when you create an update without having created a build with the same configuration:

```
No compatible builds found for the following fingerprints:
    iOS fingerprint:  c3569e540dba3c005376b1b5acad84ae2e873867
    Android fingerprint:  551c3333d86a0f1a1afaab536be849dc22a222fe
```

**Solution**: Create a build with the same configuration using:
```bash
npx eas build --profile preview --platform all
```

### Update Command Fails

If the update command fails:

1. Check your Expo and EAS CLI versions:
   ```bash
   expo --version
   eas-cli --version
   ```

2. Update if needed:
   ```bash
   npm install -g eas-cli expo-cli
   ```

3. Verify your project has the correct configuration in `app.json` and `eas.json`

4. Try with verbose logging:
   ```bash
   npx eas update --branch YOUR_BRANCH_NAME --message "Test" --verbose
   ```

## Common Commands Reference

| Command | Description |
|---------|-------------|
| `npx eas update --branch BRANCH_NAME --message "Message"` | Create update for specific branch |
| `npx eas-cli update:list` | List all branches with updates |
| `npx eas-cli update:list --branch BRANCH_NAME` | List updates for specific branch |
| `npx eas build --profile preview --platform all` | Create preview build for all platforms |
| `npx eas build --profile preview --platform android` | Create preview build for Android only |
| `npx eas build --profile preview --platform ios` | Create preview build for iOS only |

## Best Practices

- **Use meaningful branch names** that match your git branches
- Include **descriptive update messages** to track changes
- Create **separate branches** for different features or versions
- **Test updates** on actual devices before sharing widely
- Consider using **rollouts** for production updates (percentage-based)
