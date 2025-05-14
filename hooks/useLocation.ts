import { useState, useRef } from 'react';
import * as Location from 'expo-location';
import { showAlert } from '@/utils/alert';
import { LocationObject, Region } from '@/types';

export function useLocation() {
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const lastLocationRequest = useRef<number>(0);

  const centerOnUser = async (setRegion: (region: Region) => void): Promise<boolean> => {
    try {
      // Check if we have a recent location (within the last 10 seconds)
      const now = Date.now();
      const useCache = userLocation && (now - lastLocationRequest.current < 10000);

      if (useCache) {
        console.log('Using cached location');
        setRegion({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        return true;
      }

      // Otherwise get a new location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        showAlert('Permission Denied', 'Location permission is required to use this feature.', 'warning');
        return false;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
        mayShowUserSettingsDialog: false
      });

      // Update the timestamp
      lastLocationRequest.current = now;

      setUserLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      return true;
    } catch (error) {
      showAlert('Error', 'Could not get your location. Please try again.', 'error');
      console.error(error);
      return false;
    }
  };

  return { userLocation, centerOnUser };
}
