import { useState, useRef, useEffect } from 'react';
import * as Location from 'expo-location';
import { showAlert } from '@/utils/alert';
import { LocationObject, Region } from '@/types';
import MapView from 'react-native-maps';
import { RefObject } from 'react';

export function useLocation() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const centerOnUser = async (mapRef: RefObject<MapView | null>): Promise<boolean> => {
    try {
      // Cancel any ongoing location request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      // Check permissions first(double check when we get dev build if this can be omitted)
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
        if (newStatus !== 'granted') {
          showAlert('Permission Required', 'Location permission is needed to center the map on your location.', 'warning');
          setIsLoading(false);
          return false;
        }
      }

      // Check if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
        return false;
      }

      // Get current location and animate to it
      if (mapRef.current) {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          mayShowUserSettingsDialog: false,
          timeInterval: 5000, // 5 second timeout
        });

        // Check if request was cancelled during location fetch
        if (abortControllerRef.current?.signal.aborted) {
          setIsLoading(false);
          return false;
        }

        setUserLocation(currentLocation);

        const userRegion: Region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        // Animate to the user's location with smooth animation
        mapRef.current.animateToRegion(userRegion, 1000);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        showAlert('Error', 'Map is not ready. Please try again.', 'error');
        return false;
      }
    } catch (error) {
      setIsLoading(false);

      // Don't show error if request was cancelled
      if (abortControllerRef.current?.signal.aborted) {
        return false;
      }

      console.error('Location error:', error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          showAlert('Timeout', 'Location request timed out. Please try again.', 'warning');
        } else if (error.message.includes('denied')) {
          showAlert('Permission Denied', 'Location access was denied. Please enable location services.', 'warning');
        } else {
          showAlert('Location Error', 'Could not get your location. Please check your GPS and try again.', 'error');
        }
      } else {
        showAlert('Error', 'Could not get your location. Please try again.', 'error');
      }

      return false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { userLocation, centerOnUser, isLoading };
}
