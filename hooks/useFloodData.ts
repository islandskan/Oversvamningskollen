import { useState, useEffect, useCallback } from 'react';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { floodRiskService } from '@/services/floodRiskService';
import { showAlert } from '@/utils/alert';
import { FloodRiskArea, LocationQuery } from '@/types';

export function useFloodData() {
  const [data, setData] = useState<FloodRiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (locationQuery?: LocationQuery) => {
    setLoading(true);
    setError(null);

    try {
      const floodRisks = locationQuery
        ? await floodRiskService.getFloodRisksByLocation(locationQuery)
        : await floodRiskService.getFloodRisks();
      setData(floodRisks);
    } catch (err) {
      showAlert("Couldn't load flood data", "Please check your connection", "warning");
      setData(mockData);
      setError("Failed to fetch flood risk data");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFloodRiskById = useCallback(async (id: number) => {
    try {
      return await floodRiskService.getFloodRiskById(id);
    } catch (err) {
      showAlert("Error", `Failed to fetch flood risk with ID ${id}.`, "error");
      return null;
    }
  }, []);

  const updateUserLocation = useCallback(async (location: { latitude: number; longitude: number }) => {
    try {
      await floodRiskService.updateUserLocation(location);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchFloodRisks: () => fetchData(),
    fetchFloodRisksByLocation: (location: LocationQuery) => fetchData(location),
    fetchFloodRiskById,
    updateUserLocation
  };
}