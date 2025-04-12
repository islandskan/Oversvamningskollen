import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { FloodRiskArea, floodRiskAreas as mockData } from '@/data/floodRiskData';

// simple hook to fetch flood risk data
// todo: replace mock data with actual API call when backend is ready
export function useFloodData() {
  const [data, setData] = useState<FloodRiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // simulate api call with timeout
    setLoading(true);
    
    // fake api delay for testing loading states
    const timer = setTimeout(() => {
      try {
        // for now, just use our mock data
        // later: fetch(`https://api.floodcast.com/risk-areas`)
        setData(mockData);
      } catch (err) {
        console.log("failed to load data:", err);
        Alert.alert("Couldn't load flood data", "Please check your connection and try again");
        setData([]); // set empty array on error
      } finally {
        setLoading(false);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return { data, loading };
}