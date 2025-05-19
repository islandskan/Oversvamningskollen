import { useState } from 'react';
import * as Location from 'expo-location';
import { showAlert } from '@/Frontend/utils/alert';

export const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setHasPermission(true);
        return true;
      } else {
        showAlert(
          'Permission Denied',
          'Location permission is required to use this feature.',
          'warning'
        );
        setHasPermission(false);
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };

  return {
    hasPermission,
    requestLocationPermission
  };
};