import { api } from './api';
import { FloodRiskArea } from '@/Frontend/data/floodRiskData';

// Response interface for flood risk endpoints
interface FloodRiskResponse {
  message?: string;
  floodRisk?: FloodRiskArea;
  floodRisks?: FloodRiskArea[];
}

// Location interface for querying flood risks by location
export interface LocationQuery {
  latitude: number;
  longitude: number;
  radius?: number; // in meters
}

/**
 * Flood Risk service for interacting with flood risk endpoints
 */
export const floodRiskService = {
  /**
   * Get all flood risk areas
   */
  async getFloodRisks(): Promise<FloodRiskArea[]> {
    const response = await api.get<FloodRiskResponse>('/api/flood-risks');
    return response.floodRisks || [];
  },
  
  /**
   * Get flood risk areas by location
   */
  async getFloodRisksByLocation(location: LocationQuery): Promise<FloodRiskArea[]> {
    const { latitude, longitude, radius } = location;
    let endpoint = `/api/flood-risks?latitude=${latitude}&longitude=${longitude}`;
    
    if (radius) {
      endpoint += `&radius=${radius}`;
    }
    
    const response = await api.get<FloodRiskResponse>(endpoint);
    return response.floodRisks || [];
  },
  
  /**
   * Get a flood risk area by ID
   */
  async getFloodRiskById(id: number): Promise<FloodRiskArea | null> {
    try {
      const response = await api.get<FloodRiskResponse>(`/api/flood-risks/${id}`);
      return response.floodRisk || null;
    } catch (error) {
      if (error instanceof Error && error.name === 'ApiError' && (error as any).status === 404) {
        return null;
      }
      throw error;
    }
  },
  
  /**
   * Update user location for location-based alerts
   */
  async updateUserLocation(location: { latitude: number; longitude: number }): Promise<void> {
    await api.post<{ message: string }>('/api/users/location', location);
  },
};
