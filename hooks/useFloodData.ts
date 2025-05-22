import { useState, useEffect, useCallback } from 'react';
import { floodRiskAreas as mockData } from '@/data/floodRiskData';
import { getFloodRisks, getFloodRiskById, updateUserLocation } from '@/services/floodRiskService';
import { showAlert } from '@/utils/alert';
import { FloodRiskArea } from '@/types';

export function useFloodData() {
  const [data, setData] = useState<FloodRiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const floodRisks = await getFloodRisks();
      setData(floodRisks);
    } catch (err) {
      const errorMessage = "Failed to fetch flood risk data";
      setError(errorMessage);

      // Show user-friendly message and fall back to mock data
      showAlert("Couldn't load flood data", "Using offline data instead", "warning");
      setData(mockData);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFloodRiskById = useCallback(async (id: number) => {
    try {
      return await getFloodRiskById(id);
    } catch (err) {
      showAlert("Error", `Failed to fetch flood risk with ID ${id}.`, "error");
      return mockData.find(risk => risk.id === id) || null;
    }
  }, []);

  const updateLocationSafe = useCallback(async (location: { latitude: number; longitude: number }) => {
    try {
      await updateUserLocation(location);
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
    fetchFloodRisks: fetchData,
    fetchFloodRiskById,
    updateUserLocation: updateLocationSafe
  };
}