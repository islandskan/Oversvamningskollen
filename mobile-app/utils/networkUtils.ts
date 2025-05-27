import NetInfo from '@react-native-community/netinfo';

export async function isConnected(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === true;
}

export const API_BASE_URL = 'https://oversvamningskollen.vercel.app';

export async function isServerReachable(baseUrl: string = API_BASE_URL, timeout: number = 5000): Promise<boolean> {
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
