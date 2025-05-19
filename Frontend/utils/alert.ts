import { useNotificationStore, AlertData } from '@/Frontend/store/useNotificationStore';

/**
 * Utility function to show custom alerts throughout the application
 * This replaces the default Alert.alert from React Native
 */
export const showAlert = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  const alertData: AlertData = {
    title,
    message,
    type
  };
  
  useNotificationStore.getState().showAlert(alertData);
};
