import { useState, useEffect, useCallback } from 'react';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { floodRiskService } from '@/services/floodRiskService';
import { showAlert } from '@/utils/alert';
import { FloodRiskArea, LocationQuery } from '@/types';

// Hook to fetch flood risk data from the PostgreSQL database
export function useFloodData() {
  const [data, setData] = useState<FloodRiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generic fetch function to reduce duplication
  const fetchFloodData = useCallback(async (
    fetchFn: () => Promise<FloodRiskArea[]>,
    errorMsg: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const floodRisks = await fetchFn();
      setData(floodRisks);
    } catch (err) {
      console.error(errorMsg, err);
      showAlert("Couldn't load flood data", "Please check your connection and try again", "warning");

      // Fallback to mock data in case of error
      console.log("Using mock data as fallback");
      setData(mockData);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all flood risk areas
  const fetchFloodRisks = useCallback(() => {
    return fetchFloodData(
      () => floodRiskService.getFloodRisks(),
      "Failed to fetch flood risk data"
    );
  }, [fetchFloodData]);

  // Fetch flood risk areas by location
  const fetchFloodRisksByLocation = useCallback((location: LocationQuery) => {
    return fetchFloodData(
      () => floodRiskService.getFloodRisksByLocation(location),
      "Failed to fetch flood risk data by location"
    );
  }, [fetchFloodData]);

  // Fetch a specific flood risk area by ID
  const fetchFloodRiskById = useCallback(async (id: number) => {
    try {
      return await floodRiskService.getFloodRiskById(id);
    } catch (err) {
      console.error(`Failed to fetch flood risk with ID ${id}:`, err);
      showAlert("Error", `Failed to fetch flood risk with ID ${id}.`, "error");
      return null;
    }
  }, []);

  // Update user location for location-based alerts
  const updateUserLocation = useCallback(async (location: { latitude: number; longitude: number }) => {
    try {
      await floodRiskService.updateUserLocation(location);
      return true;
    } catch (err) {
      console.error("Failed to update user location:", err);
      return false;
    }
  }, []);

  // Fetch all flood risk areas on mount
  useEffect(() => {
    fetchFloodRisks();
  }, [fetchFloodRisks]);

  return {
    data,
    loading,
    error,
    fetchFloodRisks,
    fetchFloodRisksByLocation,
    fetchFloodRiskById,
    updateUserLocation
  };
}