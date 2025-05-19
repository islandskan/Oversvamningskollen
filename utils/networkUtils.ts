import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';


export async function isConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}


export function getApiBaseUrl(): string {
  // IMPORTANT: Change this to your computer's IPv 4 address
  //10.2.2.2 for simulator
  // Later it will deployed to vercel so no need for manual ipv4 checks
  // !NOTE TO SELF REMEMBER TO UPDATE THIS DAILY OR YOU'LL LOSE YOUR WIND
  // !NOTE TO SELF REMEMBER TO UPDATE THIS DAILY OR YOU'LL LOSE YOUR WIND
  // !NOTE TO SELF REMEMBER TO UPDATE THIS DAILY OR YOU'LL LOSE YOUR WIND
  // !NOTE TO SELF REMEMBER TO UPDATE THIS DAILY OR YOU'LL LOSE YOUR WIND
  // !NOTE TO SELF REMEMBER TO UPDATE THIS DAILY OR YOU'LL LOSE YOUR WIND
  /* ALSO REMEMBER TO CHANGE THIS WHEN SWAPPING BETWEEN TETHERING AND WIFI */
  const LOCAL_IP = "192.168.51.142";

  const PORT = 3000;

  return Platform.select({
    web: `http://localhost:${PORT}`,
    ios: `http://localhost:${PORT}`,
    // IMPORTANT For Android physical devices, use the computer's IPv 4  address
    android: `http://${LOCAL_IP}:${PORT}`,
  }) || `http://${LOCAL_IP}:${PORT}`;
}


export async function isServerReachable(baseUrl: string = getApiBaseUrl(), timeout: number = 5000): Promise<boolean> {
  try {
    // Use a simple health check endpoint that should be available
    const url = `${baseUrl}/health`;
    console.log(`Checking if server is reachable at: ${url}`);

    // Check network connectivity first
    const connected = await isConnected();
    if (!connected) {
      console.error('No network connection available');
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Simple health check request
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

        // If health endpoint fails, try a fallback to any endpoint
        if (response.status === 404) {
          console.log('Health endpoint not found, trying fallback check');
          return await isServerReachableFallback(baseUrl, timeout);
        }
      }

      return isOk;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Health check request was aborted due to timeout');
      } else {
        console.log('Health check failed, trying fallback check');
      }

      // Try fallback check
      return await isServerReachableFallback(baseUrl, timeout);
    }
  } catch (error) {
    console.log('Server reachability check failed completely:', error);
    if (error instanceof Error) {
      console.log(`Error type: ${error.name}, message: ${error.message}`);
    }
    return false;
  }
}

// Fallback check that tries to connect to any endpoint
async function isServerReachableFallback(baseUrl: string, timeout: number): Promise<boolean> {
  try {
    // Try the root endpoint as fallback
    const url = baseUrl;
    console.log(`Trying fallback server check at: ${url}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    // Any response means the server is up, even if it's a 404
    console.log(`Fallback check result: SUCCESS (Status: ${response.status})`);
    return true;
  } catch (error) {
    console.log('Fallback server check failed:', error);
    if (error instanceof Error) {
      console.log(`Error type: ${error.name}, message: ${error.message}`);

      if (error.name === 'AbortError') {
        console.log('Fallback request was aborted due to timeout');
      } else if (error.message.includes('Network request failed')) {
        console.log('Network request failed - server is unreachable');
      }
    }
    return false;
  }
}
