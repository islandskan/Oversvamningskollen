import { FloodRiskArea, LocationQuery } from '@/types';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { FLOOD_RISK_RADIUS } from '@/constants/FloodRiskConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, isConnected } from '@/utils/networkUtils';
import { ApiError } from '@/context/AuthContext';

const BASE_URL = getApiBaseUrl();
const TIMEOUT = 15000;
const AUTH_TOKEN_KEY = 'auth_token';

const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
};

async function apiRequest<T = any>(
  method: string,
  endpoint: string,
  data?: any
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const connected = await isConnected();
  if (!connected) {
    throw new ApiError('No network connection', 0);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      signal: controller.signal,
    };

    if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      fetchOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const responseData = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new ApiError(
        responseData.message || 'An error occurred',
        response.status,
        responseData
      );
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Backend data types
interface SensorData {
  id: number;
  installation_date: string;
  battery_status: number;
  longitude: number;
  latitude: number;
  location_description: string;
  sensor_failure: boolean;
  lost_communication: boolean;
  emergency_contacts?: {
    id: number;
    sensor_id: number;
    name: string;
    phone_number: string;
  }[];
}

interface WaterLevelData {
  sensor_id: number;
  waterlevel: number;
  rate_of_change: number;
  measured_at: string;
}

interface SensorResponse {
  message?: string;
  sensor?: SensorData;
  sensors?: SensorData[];
}

interface WaterLevelResponse {
  message?: string;
  latest?: WaterLevelData;
  data?: WaterLevelData[];
  latest_readings?: WaterLevelData[];
}

// Process sensor data and water level to create flood risk information
function processFloodRiskData(
  sensor: SensorData,
  waterLevel: WaterLevelData | undefined
): FloodRiskArea | null {
  if (sensor.sensor_failure) return null;

  // Process coordinates based on format
  const coordinates = {
    longitude: sensor.longitude > 1000000 ? sensor.longitude / 1000000 : sensor.longitude / 1000,
    latitude: sensor.latitude > 1000000 ? sensor.latitude / 1000000 : sensor.latitude / 1000
  };

  const level = waterLevel?.waterlevel ?? 0;
  const rate = waterLevel?.rate_of_change ?? 0;

  let riskLevel: 'high' | 'medium' | 'low';
  if (level > 3 || rate > 2) riskLevel = 'high';
  else if (level > 2 || rate > 1) riskLevel = 'medium';
  else riskLevel = 'low';

  const radius = riskLevel === 'high' ? FLOOD_RISK_RADIUS.HIGH :
                riskLevel === 'medium' ? FLOOD_RISK_RADIUS.MEDIUM :
                FLOOD_RISK_RADIUS.LOW;

  // Format title and description
  const riskText = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const title = `${riskText} Risk Area`;

  const locationName = sensor.location_description || 'this area';
  const severity = !waterLevel ? 'Potential' :
                  level > 3 ? 'Severe' :
                  level > 2 ? 'Moderate' : 'Minor';
  const description = `${severity} flooding expected in ${locationName}`;

  // Create detailed information
  const detailedInfo = {
    waterLevel: level === undefined ? 'Data unavailable' : `${level/2} meters above normal`,
    probability: !waterLevel ? 'Unknown' : level > 3 ? '75%' : level > 2 ? '50%' : '25%',
    timeframe: rate === undefined ? 'Unknown' :
               rate > 2 ? 'Next 24-48 hours' :
               rate > 1 ? 'Next 48-72 hours' : 'Next 3-5 days',
    affectedArea: !locationName ? 'Surrounding area' : `${locationName} and surrounding areas`,
    evacuationStatus: riskLevel === 'high' ? 'Evacuation recommended' :
                     riskLevel === 'medium' ? 'Be prepared for possible evacuation' :
                     'No evacuation needed, stay informed',
    emergencyContacts: !sensor.emergency_contacts || sensor.emergency_contacts.length === 0 ?
                      'Emergency Services: 112' :
                      sensor.emergency_contacts.map(c => `${c.name}: ${c.phone_number}`).join('\n')
  };

  return {
    id: sensor.id,
    coordinate: coordinates,
    title,
    description,
    radius,
    riskLevel,
    detailedInfo
  };
}

// Extract water level data from API response
function extractWaterLevelData(response: WaterLevelResponse): WaterLevelData[] {
  if (response.latest_readings?.length) return response.latest_readings;
  if (response.data?.length) return response.data;
  if (response.latest) return [response.latest];
  return [];
}

export const floodRiskService = {
  async getFloodRisks(): Promise<FloodRiskArea[]> {
    try {
      // Fetch sensors and water levels
      const sensorsResponse = await apiRequest<SensorResponse>('GET', '/api/sensors');
      const waterLevelsResponse = await apiRequest<WaterLevelResponse>('GET', '/api/sensors/waterlevels');

      const validSensors = (sensorsResponse.sensors || []).filter((sensor: SensorData) => !sensor.sensor_failure);
      const waterLevelData = extractWaterLevelData(waterLevelsResponse);

      // Process each sensor with its corresponding water level data
      return validSensors
        .map((sensor: SensorData) => {
          const sensorWaterLevel = waterLevelData.find(wl => wl.sensor_id === sensor.id);
          return processFloodRiskData(sensor, sensorWaterLevel);
        })
        .filter(Boolean) as FloodRiskArea[];
    } catch (error) {
      return mockData;
    }
  },

  async getFloodRisksByLocation(_location: LocationQuery): Promise<FloodRiskArea[]> {
    // Location parameter is unused but kept for future implementation
    return this.getFloodRisks();
  },

  async getFloodRiskById(id: number): Promise<FloodRiskArea | null> {
    try {
      const sensorResponse = await apiRequest<SensorResponse>('GET', `/api/sensors/${id}`);
      const sensor = sensorResponse.sensor;

      if (!sensor || sensor.sensor_failure) return null;

      const waterLevelsResponse = await apiRequest<WaterLevelResponse>('GET', '/api/sensors/waterlevels');
      const waterLevelData = extractWaterLevelData(waterLevelsResponse);
      const sensorWaterLevel = waterLevelData.find(wl => wl.sensor_id === sensor.id);

      return processFloodRiskData(sensor, sensorWaterLevel);
    } catch (error) {
      const mockRisk = mockData.find(risk => risk.id === id);
      return mockRisk || null;
    }
  },

  async updateUserLocation(_location: { latitude: number; longitude: number }): Promise<void> {
    // Placeholder for future implementation
  }
};


