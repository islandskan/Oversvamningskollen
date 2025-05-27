import { LocationSearchResult, SearchSuggestion } from '@/types';
import { isConnected } from '@/utils/networkUtils';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const SEARCH_TIMEOUT = 8000;

export class LocationSearchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocationSearchError';
  }
}

export async function searchLocations(query: string, limit: number = 5): Promise<SearchSuggestion[]> {
  if (!query.trim()) {
    return [];
  }

  if (!(await isConnected())) {
    throw new LocationSearchError('No network connection');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT);

  try {
    const params = new URLSearchParams({
      q: query.trim(),
      format: 'json',
      limit: limit.toString(),
      addressdetails: '1',
      extratags: '1',
      namedetails: '1',
      countrycodes: 'se', // Limit search to Sweden for now might add more countries later on
      'accept-language': 'en',
    });

    const url = `${NOMINATIM_BASE_URL}/search?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'FloodCast/1.0.0',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new LocationSearchError(`Search failed: ${response.status}`);
    }

    const results: LocationSearchResult[] = await response.json();

    return results.map((result) => ({
      id: result.place_id,
      title: extractTitle(result.display_name),
      subtitle: extractSubtitle(result.display_name),
      coordinate: {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
      },
      type: result.type,
    }));

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new LocationSearchError('Search request timed out');
    }

    if (error instanceof LocationSearchError) {
      throw error;
    }

    throw new LocationSearchError('Failed to search locations');
  }
}

function extractTitle(displayName: string): string {
  const parts = displayName.split(',');
  return parts[0]?.trim() || displayName;
}

function extractSubtitle(displayName: string): string {
  const parts = displayName.split(',');
  if (parts.length > 1) {
    return parts.slice(1, 3).join(',').trim();
  }
  return '';
}

export function getZoomLevelForLocationType(type: string): { latitudeDelta: number; longitudeDelta: number } {
  const cityTypes = ['city', 'town', 'village', 'hamlet', 'municipality', 'administrative'];
  const roadTypes = ['highway', 'primary', 'secondary', 'tertiary', 'residential', 'service', 'track', 'path'];

  if (cityTypes.some(cityType => type.includes(cityType))) {
    return { latitudeDelta: 0.05, longitudeDelta: 0.05 };
  }

  if (roadTypes.some(roadType => type.includes(roadType))) {
    return { latitudeDelta: 0.01, longitudeDelta: 0.01 };
  }

  return { latitudeDelta: 0.01, longitudeDelta: 0.01 };
}
