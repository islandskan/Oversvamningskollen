import { api } from './api';
import { FloodRiskArea, LocationQuery } from '@/types';

interface FloodRiskResponse {
  message?: string;
  floodRisk?: FloodRiskArea;
  floodRisks?: FloodRiskArea[];
}

export const floodRiskService = {
  async getFloodRisks(): Promise<FloodRiskArea[]> {
    const response = await api.get<FloodRiskResponse>('/api/flood-risks');
    return response.floodRisks || [];
  },

  async getFloodRisksByLocation(location: LocationQuery): Promise<FloodRiskArea[]> {
    const { latitude, longitude, radius } = location;
    let endpoint = `/api/flood-risks?latitude=${latitude}&longitude=${longitude}`;

    if (radius) {
      endpoint += `&radius=${radius}`;
    }

    const response = await api.get<FloodRiskResponse>(endpoint);
    return response.floodRisks || [];
  },

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

  async updateUserLocation(location: { latitude: number; longitude: number }): Promise<void> {
    await api.post<{ message: string }>('/api/users/location', location);
  },
};
