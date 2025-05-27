// Common type definitions for the FloodCast application

export interface FloodRiskArea {
  id: number;
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
  radius: number;
  riskLevel: 'high' | 'medium' | 'low' | string;
  detailedInfo: {
    waterLevel: string;
    probability: string;
    timeframe: string;
    affectedArea: string;
    evacuationStatus: string;
    emergencyContacts: string;
  };
}

export interface LocationQuery {
  latitude: number;
  longitude: number;
  radius?: number; // in meters
}

export interface User {
  id: number;
  role_id: number;
  name: string;
  email: string;
  password: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  locationTracking: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface AlertData {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface LocationSearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  boundingbox: [string, string, string, string];
}

export interface SearchSuggestion {
  id: string;
  title: string;
  subtitle: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: string;
}
