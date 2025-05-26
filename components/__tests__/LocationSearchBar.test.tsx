import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocationSearchBar } from '@/components/search/LocationSearchBar';
import * as locationSearchService from '@/services/locationSearchService';

jest.mock('@/services/locationSearchService');
jest.mock('@/utils/alert');

const mockSearchLocations = locationSearchService.searchLocations as jest.MockedFunction<
  typeof locationSearchService.searchLocations
>;

const mockSuggestions = [
  {
    id: '1',
    title: 'Malmö Central Station',
    subtitle: 'Malmö, Sweden',
    coordinate: { latitude: 55.6095, longitude: 13.0007 },
    type: 'railway',
  },
  {
    id: '2',
    title: 'Turning Torso',
    subtitle: 'Västra Hamnen, Malmö',
    coordinate: { latitude: 55.6133, longitude: 12.9755 },
    type: 'building',
  },
];

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider initialMetrics={{ insets: { top: 0, left: 0, right: 0, bottom: 0 }, frame: { x: 0, y: 0, width: 0, height: 0 } }}>
    {children}
  </SafeAreaProvider>
);

describe('LocationSearchBar', () => {
  const mockOnLocationSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchLocations.mockResolvedValue(mockSuggestions);
  });

  it('renders search input correctly', () => {
    const { getByPlaceholderText } = render(
      <TestWrapper>
        <LocationSearchBar onLocationSelect={mockOnLocationSelect} />
      </TestWrapper>
    );

    expect(getByPlaceholderText('Search locations...')).toBeTruthy();
  });

  it('triggers search when typing', async () => {
    const { getByPlaceholderText } = render(
      <TestWrapper>
        <LocationSearchBar onLocationSelect={mockOnLocationSelect} />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Search locations...');
    fireEvent.changeText(input, 'Malmö');

    await waitFor(() => {
      expect(mockSearchLocations).toHaveBeenCalledWith('Malmö', 5);
    });
  });

  it('displays search suggestions', async () => {
    const { getByPlaceholderText, getByText } = render(
      <TestWrapper>
        <LocationSearchBar onLocationSelect={mockOnLocationSelect} />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Search locations...');
    fireEvent.changeText(input, 'Malmö');

    await waitFor(() => {
      expect(getByText('Malmö Central Station')).toBeTruthy();
      expect(getByText('Turning Torso')).toBeTruthy();
    });
  });

  it('calls onLocationSelect when suggestion is pressed', async () => {
    const { getByPlaceholderText, getByText } = render(
      <TestWrapper>
        <LocationSearchBar onLocationSelect={mockOnLocationSelect} />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Search locations...');
    fireEvent.changeText(input, 'Malmö');

    await waitFor(() => {
      expect(getByText('Malmö Central Station')).toBeTruthy();
    });

    fireEvent.press(getByText('Malmö Central Station'));

    expect(mockOnLocationSelect).toHaveBeenCalledWith({
      latitude: 55.6095,
      longitude: 13.0007,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  });

  it('triggers search when search icon is pressed', async () => {
    const { getByPlaceholderText, getByLabelText } = render(
      <TestWrapper>
        <LocationSearchBar onLocationSelect={mockOnLocationSelect} />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Search locations...');
    fireEvent.changeText(input, 'Stockholm');

    const searchButton = getByLabelText('Search');
    fireEvent.press(searchButton);

    await waitFor(() => {
      expect(mockSearchLocations).toHaveBeenCalledWith('Stockholm', 5);
    });
  });

  it('clears search when clear button is pressed', () => {
    const { getByPlaceholderText, getByLabelText } = render(
      <TestWrapper>
        <LocationSearchBar onLocationSelect={mockOnLocationSelect} />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Search locations...');
    fireEvent.changeText(input, 'Test query');

    const clearButton = getByLabelText('Clear search');
    fireEvent.press(clearButton);

    expect(input.props.value).toBe('');
  });

  it('handles search errors gracefully', async () => {
    mockSearchLocations.mockRejectedValue(new Error('Network error'));

    const { getByPlaceholderText } = render(
      <TestWrapper>
        <LocationSearchBar onLocationSelect={mockOnLocationSelect} />
      </TestWrapper>
    );

    const input = getByPlaceholderText('Search locations...');
    fireEvent.changeText(input, 'Malmö');

    await waitFor(() => {
      expect(mockSearchLocations).toHaveBeenCalled();
    });
  });
});
