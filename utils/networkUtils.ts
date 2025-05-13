import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';


export async function isConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}


export function getApiBaseUrl(): string {
  // IMPORTANT: Change this to your computer's IPv 4 address
  const LOCAL_IP = "192.168.0.103";
  const PORT = 3000;

  return Platform.select({
    web: `http://localhost:${PORT}`,
    ios: `http://localhost:${PORT}`,
    // IMPORTANT For Android emulator and physical devices, use the computer's IPv 4  address
    android: `http://${LOCAL_IP}:${PORT}`,
  }) || `http://${LOCAL_IP}:${PORT}`;
}


export async function isServerReachable(baseUrl: string = getApiBaseUrl(), timeout: number = 5000): Promise<boolean> {
  try {
    // Get the platform-specific URL
    const url = `${baseUrl}/api/users`;
    console.log(`Checking if server is reachable at: ${url}`);

    // Check network connectivity first
    const connected = await isConnected();
    if (!connected) {
      console.error('No network connection available');
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Use the existing /api/users endpoint to check server reachability
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);
    const isOk = response.ok;
    console.log(`Server reachability check result: ${isOk ? 'SUCCESS' : 'FAILED'} (Status: ${response.status})`);

    if (!isOk) {
      console.log(`Response status: ${response.status}, statusText: ${response.statusText}`);
    }

    return isOk;
  } catch (error) {
    console.log('Server reachability check failed:', error);
    if (error instanceof Error) {
      console.log(`Error type: ${error.name}, message: ${error.message}`);

      if (error.name === 'AbortError') {
        console.log('Request was aborted due to timeout');
      } else if (error.message.includes('Network request failed')) {
        console.log('Network request failed - server might be unreachable or network connection issues');
      }
    }
    return false;
  }
}
