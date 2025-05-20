import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

export async function isConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}

export function getApiBaseUrl(): string {
  const LOCAL_IP = "192.168.51.142";
  const PORT = 3000;

  return Platform.select({
    web: `http://localhost:${PORT}`,
    ios: `http://localhost:${PORT}`,
    android: `http://${LOCAL_IP}:${PORT}`,
  }) || `http://${LOCAL_IP}:${PORT}`;
}

export async function isServerReachable(baseUrl: string = getApiBaseUrl(), timeout: number = 5000): Promise<boolean> {
  try {
    const connected = await isConnected();
    if (!connected) return false;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Try root endpoint first
      await fetch(baseUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
      });

      clearTimeout(timeoutId);
      return true; // Any response means server is reachable
    } catch (error) {
      clearTimeout(timeoutId);

      // If it's not a timeout error, try health endpoint as fallback
      if (!(error instanceof Error && error.name === 'AbortError')) {
        try {
          const healthController = new AbortController();
          const healthTimeoutId = setTimeout(() => healthController.abort(), timeout);

          await fetch(`${baseUrl}/health`, {
            method: 'GET',
            signal: healthController.signal
          });

          clearTimeout(healthTimeoutId);
          return true;
        } catch {
          return false;
        }
      }

      return false;
    }
  } catch (error) {
    return false;
  }
}
