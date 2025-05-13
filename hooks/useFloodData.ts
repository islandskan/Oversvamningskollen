import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { FloodRiskArea, floodRiskAreas as mockData } from '@/data/floodRiskData';
import { floodRiskService, LocationQuery } from '@/services/floodRiskService';

// Hook to fetch flood risk data from the PostgreSQL database
export function useFloodData() {
  const [data, setData] = useState<FloodRiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all flood risk areas
  const fetchFloodRisks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const floodRisks = await floodRiskService.getFloodRisks();
      setData(floodRisks);
    } catch (err) {
      console.error("Failed to load flood risk data:", err);
      Alert.alert("Couldn't load flood data", "Please check your connection and try again");

      // Fallback to mock data in case of error
      console.log("Using mock data as fallback");
      setData(mockData);

      setError("Failed to fetch flood risk data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch flood risk areas by location
  const fetchFloodRisksByLocation = useCallback(async (location: LocationQuery) => {
    setLoading(true);
    setError(null);

    try {
      const floodRisks = await floodRiskService.getFloodRisksByLocation(location);
      setData(floodRisks);
    } catch (err) {
      console.error("Failed to load flood risk data by location:", err);
      Alert.alert("Couldn't load flood data", "Please check your connection and try again");

      // Fallback to mock data in case of error
      console.log("Using mock data as fallback");
      setData(mockData);

      setError("Failed to fetch flood risk data by location");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific flood risk area by ID
  const fetchFloodRiskById = useCallback(async (id: number) => {
    try {
      return await floodRiskService.getFloodRiskById(id);
    } catch (err) {
      console.error(`Failed to fetch flood risk with ID ${id}:`, err);
      Alert.alert("Error", `Failed to fetch flood risk with ID ${id}.`);
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