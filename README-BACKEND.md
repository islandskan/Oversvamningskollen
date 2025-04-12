# FloodCast Frontend - React Native App

## Overview
FloodCast is a mobile app built with React Native and Expo that displays flood risk information on a map. This document explains the frontend architecture for backend developers who are familiar with React.

## Tech Stack
- **React Native** with **Expo** framework
- **TypeScript** for type safety
- **NativeWind** (Tailwind for React Native) for styling
- **Expo Router** for navigation (similar to React Router)
- **React Native Maps** for map functionality

## Key Differences from Web React
- Components use React Native primitives (`View`, `Text`, etc.) instead of HTML
- Styling uses StyleSheet or NativeWind instead of CSS
- Navigation uses Expo Router with file-based routing
- Platform-specific code uses `Platform.OS === 'ios'` or `Platform.OS === 'android'` checks

## Project Structure
- `/app` - Main application code with file-based routing
  - `/(tabs)` - Tab-based navigation screens
  - `_layout.tsx` - Root layout component (similar to App.js in React)
- `/components` - Reusable UI components
- `/constants` - App constants including colors and theme
- `/hooks` - Custom React hooks
- `/assets` - Images, fonts and other static assets
- `/data` - Currently contains mock data that will be replaced by API calls

## Data Flow
Currently, the app uses hardcoded sample data for flood risk areas in `data/floodRiskData.ts`. The backend will need to provide:

1. Flood risk area data (coordinates, risk level, radius)
2. Detailed information for each risk area
3. User authentication (planned feature)

## API Integration Points

### Required Endpoints
The frontend expects these REST endpoints:

1. `GET /api/flood-risks`
   - Returns all flood risk areas
   - Should support query params: `latitude`, `longitude`, `radius` (in meters)
   - Response format should match the `FloodRiskArea` interface in `data/floodRiskData.ts`

2. `GET /api/flood-risks/:id`
   - Returns detailed information for a specific flood risk area
   - Response should include all fields in the `detailedInfo` object

3. `POST /api/users/location`
   - Accepts user location updates
   - Request body: `{ latitude: number, longitude: number }`
   - Used for location-based alerts

### Authentication (Future)
We'll need these endpoints for user authentication:

1. `POST /api/auth/register`
2. `POST /api/auth/login`
3. `GET /api/auth/me`
4. `POST /api/auth/logout`

## Data Models

### FloodRiskArea
```typescript
interface FloodRiskArea {
  id: number;
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
  radius: number;  // in meters
  riskLevel: 'high' | 'medium' | 'low';
  detailedInfo: {
    waterLevel: string;
    probability: string;
    timeframe: string;
    affectedArea: string;
    evacuationStatus: string;
    emergencyContacts: string;
  };
}
```

## Integration Notes
- The frontend uses the `useFloodData` hook in `hooks/useFloodData.ts` to fetch flood data
- This hook currently returns mock data but will be updated to make API calls
- All API calls should return JSON with the same structure as the mock data
- Consider implementing pagination for large datasets
- API responses should include appropriate HTTP status codes
- Consider adding rate limiting for production

## Environment Setup
- The app uses environment variables for API URLs
- In development, the app expects the backend to be running on `http://localhost:3000`
- For production, update the API URL in the environment config

## Getting Started
1. Install dependencies: `npm install`
2. Start the development server: `npx expo start`
3. Run on Expo Go:
   - Install the Expo Go app on your physical device:
     - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
     - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - Scan the QR code from the terminal with your device camera
   - The app will open in Expo Go on your physical device
4. Run on iOS simulator: Press `i` in terminal
5. Run on Android emulator: Press `a` in terminal

## Notes for Backend Developers
- The app uses geolocation, so endpoints should accept lat/long parameters
- Consider response size for mobile data usage
- We're using a dark/light theme toggle, so any web components should support both themes
- For testing, you can use the mock data in `data/floodRiskData.ts` as a reference
- The app expects responses within 5 seconds before timing out

