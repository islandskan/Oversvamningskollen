import { api } from './api';
import { FloodRiskArea, LocationQuery } from '@/types';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { FLOOD_RISK_RADIUS } from '@/constants/FloodRiskConstants';

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
  latest_readings?: {
    sensor_id: number;
    waterlevel: number;
    rate_of_change: number;
    measured_at: string;
  }[];
}

// Convert from backend format to standard GPS coordinates
function convertCoordinates(longitude: number, latitude: number) {
  // Check if coordinates are in the new format (larger numbers)
  if (longitude > 1000000 || latitude > 1000000) {
    return {
      longitude: longitude / 1000000,
      latitude: latitude / 1000000
    };
  }

  // Handle original format
  return {
    longitude: longitude / 1000,
    latitude: latitude / 1000
  };
}

function calculateRiskLevel(
  waterLevel: number | undefined,
  rateOfChange: number | undefined
): 'high' | 'medium' | 'low' {
  const level = waterLevel ?? 0;
  const rate = rateOfChange ?? 0;

  if (level > 3 || rate > 2) {
    return 'high';
  } else if (level > 2 || rate > 1) {
    return 'medium';
  } else {
    return 'low';
  }
}

function getRiskRadius(riskLevel: string): number {
  switch (riskLevel) {
    case 'high': return FLOOD_RISK_RADIUS.HIGH;
    case 'medium': return FLOOD_RISK_RADIUS.MEDIUM;
    case 'low': return FLOOD_RISK_RADIUS.LOW;
    default: return FLOOD_RISK_RADIUS.DEFAULT;
  }
}

function formatWaterLevel(level: number | undefined): string {
  if (level === undefined) return 'Data unavailable';
  return `${level/2} meters above normal`;
}

function calculateProbability(waterLevel: WaterLevelData | undefined): string {
  if (!waterLevel) return 'Unknown';

  const level = waterLevel.waterlevel;
  if (level > 3) return '75%';
  if (level > 2) return '50%';
  return '25%';
}

function estimateTimeframe(rateOfChange: number | undefined): string {
  if (rateOfChange === undefined) return 'Unknown';

  if (rateOfChange > 2) return 'Next 24-48 hours';
  if (rateOfChange > 1) return 'Next 48-72 hours';
  return 'Next 3-5 days';
}

function generateTitle(sensor: SensorData, riskLevel: string): string {
  const riskText = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
  return `${riskText} Risk Area`;
}

function generateDescription(sensor: SensorData, waterLevel: WaterLevelData | undefined): string {
  const locationName = sensor.location_description || 'this area';

  if (!waterLevel) {
    return `Potential flooding in ${locationName}`;
  }

  const severity = waterLevel.waterlevel > 3 ? 'Severe' :
                  waterLevel.waterlevel > 2 ? 'Moderate' : 'Minor';

  return `${severity} flooding expected in ${locationName}`;
}

function describeAffectedArea(location: string | undefined): string {
  if (!location) return 'Surrounding area';
  return `${location} and surrounding areas`;
}

function getEvacuationStatus(riskLevel: string): string {
  switch (riskLevel) {
    case 'high': return 'Evacuation recommended';
    case 'medium': return 'Be prepared for possible evacuation';
    case 'low': return 'No evacuation needed, stay informed';
    default: return 'Stay informed of changing conditions';
  }
}

function formatEmergencyContacts(contacts: SensorData['emergency_contacts']): string {
  if (!contacts || contacts.length === 0) {
    return 'Emergency Services: 112';
  }

  return contacts.map(contact => `${contact.name}: ${contact.phone_number}`).join('\n');
}

// Helper function to extract water level data from API response
function extractWaterLevelData(response: WaterLevelResponse): WaterLevelData[] {
  let waterLevelData: WaterLevelData[] = [];

  // Check if data is in latest_readings array (based on logs)
  if (response.latest_readings && response.latest_readings.length > 0) {
    console.log('Found water level data in latest_readings');
    waterLevelData = response.latest_readings.map(reading => ({
      sensor_id: reading.sensor_id,
      waterlevel: reading.waterlevel,
      rate_of_change: reading.rate_of_change,
      measured_at: reading.measured_at
    }));
  }
  // Fallback to data array if available
  else if (response.data && response.data.length > 0) {
    console.log('Found water level data in data array');
    waterLevelData = response.data;
  }
  // Last resort: check if there's a single latest reading
  else if (response.latest) {
    console.log('Found single latest water level reading');
    waterLevelData = [response.latest];
  }

  console.log('Processed water level data:', waterLevelData);
  return waterLevelData;
}

function transformSensorToFloodRiskData(
  sensor: SensorData,
  waterLevel: WaterLevelData | undefined
): FloodRiskArea | null {
  if (sensor.sensor_failure) {
    return null;
  }

  console.log('Transforming sensor to flood risk data:', { sensor, waterLevel });

  const coordinates = convertCoordinates(sensor.longitude, sensor.latitude);
  const riskLevel = calculateRiskLevel(waterLevel?.waterlevel, waterLevel?.rate_of_change);
  const radius = getRiskRadius(riskLevel);

  const result = {
    id: sensor.id,
    coordinate: coordinates,
    title: generateTitle(sensor, riskLevel),
    description: generateDescription(sensor, waterLevel),
    radius: radius,
    riskLevel: riskLevel,
    detailedInfo: {
      waterLevel: formatWaterLevel(waterLevel?.waterlevel),
      probability: calculateProbability(waterLevel),
      timeframe: estimateTimeframe(waterLevel?.rate_of_change),
      affectedArea: describeAffectedArea(sensor.location_description),
      evacuationStatus: getEvacuationStatus(riskLevel),
      emergencyContacts: formatEmergencyContacts(sensor.emergency_contacts)
    }
  };

  console.log('Transformed result:', result);
  return result;
}

export const floodRiskService = {
  async getFloodRisks(): Promise<FloodRiskArea[]> {
    try {
      const sensorsResponse = await api.get<SensorResponse>('/api/sensors');
      console.log('Sensors API response:', sensorsResponse);
      const allSensors = sensorsResponse.sensors || [];

      const validSensors = allSensors.filter(sensor => !sensor.sensor_failure);
      console.log('Valid sensors:', validSensors);

      const waterLevelsResponse = await api.get<WaterLevelResponse>('/api/sensors/waterlevels');
      console.log('Water levels API response:', waterLevelsResponse);

      // Extract water level data from the response
      const waterLevelData = extractWaterLevelData(waterLevelsResponse);

      const floodRiskAreas = validSensors.map(sensor => {
        // Find the water level data for this specific sensor
        const sensorWaterLevel = waterLevelData.find(wl => wl.sensor_id === sensor.id);

        console.log(`Matching water level for sensor ${sensor.id}:`, sensorWaterLevel);

        return transformSensorToFloodRiskData(sensor, sensorWaterLevel);
      }).filter(Boolean) as FloodRiskArea[]; // Remove any null results

      console.log('Transformed flood risk areas:', floodRiskAreas);
      return floodRiskAreas;
    } catch (error) {
      console.error('Failed to fetch flood risks:', error);
      throw error;
    }
  },

  async getFloodRisksByLocation(location: LocationQuery): Promise<FloodRiskArea[]> {
    // This endpoint doesn't exist in the current API
    // For now, we'll just return all flood risks
    return this.getFloodRisks();
  },

  async getFloodRiskById(id: number): Promise<FloodRiskArea | null> {
    try {
      const sensorResponse = await api.get<SensorResponse>(`/api/sensors/${id}`);
      console.log(`Sensor ${id} API response:`, sensorResponse);
      const sensor = sensorResponse.sensor;

      if (!sensor || sensor.sensor_failure) {
        console.log(`Sensor ${id} not found or failed`);
        return null;
      }

      const waterLevelsResponse = await api.get<WaterLevelResponse>('/api/sensors/waterlevels');
      console.log('Water levels for specific sensor:', waterLevelsResponse);

      // Extract water level data from the response using the same logic as getFloodRisks
      const waterLevelData = extractWaterLevelData(waterLevelsResponse);

      // Find the water level data for this specific sensor
      const sensorWaterLevel = waterLevelData.find(wl => wl.sensor_id === sensor.id);

      console.log(`Water level found for sensor ${id}:`, sensorWaterLevel);

      return transformSensorToFloodRiskData(sensor, sensorWaterLevel);
    } catch (error) {
      console.error(`Failed to fetch flood risk with ID ${id}:`, error);
      return null;
    }
  },

  async updateUserLocation(location: { latitude: number; longitude: number }): Promise<void> {
    console.log('Updating user location:', location);
  }
};


