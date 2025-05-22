import { FloodRiskArea } from '@/types';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { FLOOD_RISK_RADIUS } from '@/constants/FloodRiskConstants';
import { apiRequest } from '@/utils/apiClient';

// Types
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

// Helper functions - broken down from the monolithic function
function normalizeCoordinates(sensor: SensorData) {
  return {
    longitude: sensor.longitude > 1000000 ? sensor.longitude / 1000000 : sensor.longitude / 1000,
    latitude: sensor.latitude > 1000000 ? sensor.latitude / 1000000 : sensor.latitude / 1000
  };
}

function calculateRiskLevel(waterLevel?: WaterLevelData): 'high' | 'medium' | 'low' {
  if (!waterLevel) return 'low';

  const { waterlevel: level, rate_of_change: rate } = waterLevel;

  if (level > 3 || rate > 2) return 'high';
  if (level > 2 || rate > 1) return 'medium';
  return 'low';
}

function buildDetailedInfo(sensor: SensorData, waterLevel?: WaterLevelData, riskLevel?: string) {
  const level = waterLevel?.waterlevel ?? 0;
  const rate = waterLevel?.rate_of_change ?? 0;
  const locationName = sensor.location_description || 'this area';

  return {
    waterLevel: level === undefined ? 'Data unavailable' : `${level/2} meters above normal`,
    probability: !waterLevel ? 'Unknown' : level > 3 ? '75%' : level > 2 ? '50%' : '25%',
    timeframe: rate === undefined ? 'Unknown' :
               rate > 2 ? 'Next 24-48 hours' :
               rate > 1 ? 'Next 48-72 hours' : 'Next 3-5 days',
    affectedArea: locationName ? `${locationName} and surrounding areas` : 'Surrounding area',
    evacuationStatus: riskLevel === 'high' ? 'Evacuation recommended' :
                     riskLevel === 'medium' ? 'Be prepared for possible evacuation' :
                     'No evacuation needed, stay informed',
    emergencyContacts: sensor.emergency_contacts?.length
      ? sensor.emergency_contacts.map(c => `${c.name}: ${c.phone_number}`).join('\n')
      : 'Emergency Services: 112'
  };
}

function processFloodRiskData(sensor: SensorData, waterLevel?: WaterLevelData): FloodRiskArea | null {
  if (sensor.sensor_failure) return null;

  const coordinates = normalizeCoordinates(sensor);
  const riskLevel = calculateRiskLevel(waterLevel);
  const detailedInfo = buildDetailedInfo(sensor, waterLevel, riskLevel);

  const radius = FLOOD_RISK_RADIUS[riskLevel.toUpperCase() as keyof typeof FLOOD_RISK_RADIUS];
  const riskText = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  const locationName = sensor.location_description || 'this area';

  const level = waterLevel?.waterlevel ?? 0;
  const severity = !waterLevel ? 'Potential' :
                  level > 3 ? 'Severe' :
                  level > 2 ? 'Moderate' : 'Minor';

  return {
    id: sensor.id,
    coordinate: coordinates,
    title: `${riskText} Risk Area`,
    description: `${severity} flooding expected in ${locationName}`,
    radius,
    riskLevel,
    detailedInfo
  };
}

function extractWaterLevelData(response: WaterLevelResponse): WaterLevelData[] {
  if (response.latest_readings?.length) return response.latest_readings;
  if (response.data?.length) return response.data;
  if (response.latest) return [response.latest];
  return [];
}

// Exported functions - no unnecessary service wrapper
export async function getFloodRisks(): Promise<FloodRiskArea[]> {
  const sensorsResponse = await apiRequest<SensorResponse>('GET', '/api/sensors');
  const waterLevelsResponse = await apiRequest<WaterLevelResponse>('GET', '/api/sensors/waterlevels');

  const validSensors = (sensorsResponse.sensors || []).filter(sensor => !sensor.sensor_failure);
  const waterLevelData = extractWaterLevelData(waterLevelsResponse);

  return validSensors
    .map(sensor => {
      const sensorWaterLevel = waterLevelData.find(wl => wl.sensor_id === sensor.id);
      return processFloodRiskData(sensor, sensorWaterLevel);
    })
    .filter(Boolean) as FloodRiskArea[];
}

export async function getFloodRiskById(id: number): Promise<FloodRiskArea | null> {
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
}

export async function updateUserLocation(location: { latitude: number; longitude: number }): Promise<void> {
  // Implementation when needed
  console.log('Location update not implemented yet:', location);
}


