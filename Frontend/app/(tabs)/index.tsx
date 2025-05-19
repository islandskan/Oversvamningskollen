import React, { useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet, View } from 'react-native';
import { showAlert } from '@/Frontend/utils/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useColorScheme } from '@/Frontend/hooks/useColorScheme';
import { IconSymbol } from '@/Frontend/components/ui/IconSymbol';
import { FloodRiskModal } from '@/Frontend/components/FloodRiskModal';
import { FloodRiskArea } from '@/Frontend/data/floodRiskData';
import { mapDarkStyle } from '@/Frontend/constants/mapStyles';
import { useFloodData } from '@/Frontend/hooks/useFloodData';

interface LocationObject {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [userLocation, setUserLocation] = useState<LocationObject | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<FloodRiskArea | null>(null);
  // get flood data from our hook
  const { data: floodRiskAreas, loading } = useFloodData();

  // Malmö, Sweden coordinates
  const [region, setRegion] = useState({
    latitude: 55.6050,
    longitude: 13.0038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // get risk color based on risk level
  const getRiskColor = (riskLevel: 'high' | 'medium' | 'low' | string): string => {
    switch(riskLevel) {
      case 'high': return 'rgba(255, 0, 0, 0.2)';
      case 'medium': return 'rgba(255, 165, 0, 0.2)';
      case 'low': return 'rgba(255, 204, 0, 0.2)';
      default: return 'rgba(0, 0, 255, 0.2)';
    }
  };

  // Function to center map on user's location
  const centerOnUser = async () => {
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        showAlert('Permission Denied', 'Location permission is required to use this feature.', 'warning');
        return;
      }

      // Get location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      // Update state and center map with more zoom
      setUserLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01, // More zoomed in (smaller value = more zoom)
        longitudeDelta: 0.01, // More zoomed in (smaller value = more zoom)
      });
    } catch (error: any) {
      showAlert('Error', 'Could not get your location. Please try again.', 'error');
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 relative">
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        onRegionChangeComplete={setRegion}
        // defaults to Apple Maps on iOS
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        customMapStyle={colorScheme === 'dark' ? mapDarkStyle : []}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* display flood risk areas */}
        {floodRiskAreas.map((area) => (
          <React.Fragment key={area.id}>
            <Circle
              center={area.coordinate}
              radius={area.radius}
              fillColor={getRiskColor(area.riskLevel)}
              strokeColor={getRiskColor(area.riskLevel).replace('0.2', '0.5')}
              strokeWidth={2}
            />
            <Marker
              coordinate={area.coordinate}
              pinColor={area.riskLevel === 'high' ? 'red' : area.riskLevel === 'medium' ? 'orange' : 'yellow'}
              onPress={() => {
                setSelectedArea(area);
                setModalVisible(true);
              }}
            />
          </React.Fragment>
        ))}

        {/* display user location marker only when available */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Your Location"
          >
            <View className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-white" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* center to user location icon  */}
      <TouchableOpacity
        className={`absolute bottom-24 right-4 w-12 h-12 rounded-full justify-center items-center shadow-md ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        onPress={centerOnUser}
        activeOpacity={0.7}
      >
        <IconSymbol
          name="location.fill"
          size={24}
          color={colorScheme === 'dark' ? '#ffffff' : '#000000'}
        />
      </TouchableOpacity>

      <FloodRiskModal
        visible={modalVisible}
        selectedArea={selectedArea}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}







