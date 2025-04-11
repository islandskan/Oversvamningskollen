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

## Data Flow
Currently, the app uses hardcoded sample data for flood risk areas. The backend will need to provide:
1. Flood risk area data (coordinates, risk level, radius)
2. Detailed information for each risk area
3. User authentication (planned feature)

## API Integration Points
We'll need endpoints for:
- Fetching flood risk data based on map region
- User location-based risk alerts
- Authentication (future feature)

## Getting Started
1. Install dependencies: `npm install`
2. Start the development server: `npx expo start`
3. Run on iOS simulator: Press `i` in terminal
4. Run on Android emulator: Press `a` in terminal

## Notes for Backend Developers
- The app uses geolocation, so endpoints should accept lat/long parameters
- Consider response size for mobile data usage
- We're using a dark/light theme toggle, so any web components should support both themes