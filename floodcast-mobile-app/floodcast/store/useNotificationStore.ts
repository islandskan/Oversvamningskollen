import { create } from 'zustand';

export interface AlertData {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  activeAlert: AlertData | null;
  isAlertVisible: boolean;
  showAlert: (alert: AlertData) => void;
  hideAlert: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  activeAlert: null,
  isAlertVisible: false,
  
  showAlert: (alert: AlertData) => set({ 
    activeAlert: alert, 
    isAlertVisible: true 
  }),
  
  hideAlert: () => set({ 
    isAlertVisible: false 
  }),
}));
