# FloodCast - Flood Risk Monitoring App

##  LOGIN CREDENTIALS FOR TESTING (OR SIGN UP FOR FREE)
- alice@example.com
- securepassword1

## EXPO GO PREVIEW (REQUIRES EXPO GO APP)

- https://expo.dev/preview/update?message=added%20search%20bar&updateRuntimeVersion=1.0.0&createdAt=2025-05-25T23%3A56%3A12.917Z&slug=exp&projectId=fd631fd1-eadf-4299-ae85-1d055bed0dd4&group=1f4657d8-309e-4a05-9872-8067c9d334fa

--!IMPORTANT , select expo go not development build in the preview page!--

##!IMPORTANT
- When trying the app from console press s after bun s to use expo go, dev build will not work. 


## 📱 Project Overview

FloodCast is a comprehensive mobile application designed to monitor and manage flood risks in urban areas. The system combines IoT sensor data with a user-friendly mobile interface to provide real-time flood risk information, helping municipalities and citizens respond effectively to potential flooding events.

Built with React Native and Expo, FloodCast delivers a cross-platform solution that works seamlessly on both iOS and Android devices, featuring interactive maps, real-time data visualization, and secure user authentication.

## 🌟 Key Features

- **Interactive Flood Risk Map**: Real-time visualization of flood risk areas with color-coded risk levels
- **Detailed Risk Information**: Comprehensive data on water levels, affected areas, and emergency contacts
- **Dark/Light Mode Support**: Fully responsive UI with automatic theme detection
- **Secure Authentication**: JWT-based authentication system with secure token management
- **Offline Functionality**: Fallback to mock data when network connectivity is limited

## 🛠️ Technology Stack

### Frontend
- **React Native** (0.79.2) with **Expo** (53.0.9) framework for cross-platform development
- **TypeScript** (5.3.3) for type safety and enhanced developer experience
- **NativeWind** (4.1.23) - Tailwind CSS for React Native styling
- **Expo Router** (5.0.6) for declarative, file-based navigation
- **React Native Maps** (1.20.1) for interactive map functionality

### Development & Testing
- **Jest** (29.2.1) with **Jest Expo** for unit testing
- **React Testing Library** for component testing
- **EAS Build** for streamlined deployment and testing on the cloud (pro tip:less queues at night/weekends)
- **TypeScript** for static type checking

### Backend Integration
- **RESTful API** integration with JWT authentication
- **PostgreSQL DB hosted on Vercel** database with optimized schema for sensor data
- **Data processing** with fallback to mock data

## 📂 Project Structure

```
floodcast/
├── app/                    # Main application code (Expo Router)
│   ├── (tabs)/             # Tab-based navigation screens
│   │   ├── index.tsx       # Home screen with map
│   │   └── settings.tsx    # Settings and preferences
│   ├── _layout.tsx         # Root layout with authentication
│   ├── index.tsx           # Entry point and route guard
│   ├── login.tsx           # User authentication
│   └── signup.tsx          # User registration
├── components/             # Reusable UI components
│   ├── flood-risk-modal/   # Modal components for risk details
│   └── ui/                 # Common UI components
├── constants/              # App constants and theme configuration
├── context/                # React context providers (Auth)
├── hooks/                  # Custom React hooks
├── services/               # API service layer
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
└── assets/                 # Static assets (images, fonts)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`
  
- [OPTIONAL:]
- Android Studio (for Android development, especially when wanting to build locally instead of on EAS)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd floodcast
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with:
   ```
   MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run s
   # or
   npx expo start
   ```





```




