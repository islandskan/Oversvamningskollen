import React, { useState } from 'react';
import { Platform, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FloodRiskModal } from '@/components/FloodRiskModal';
import { mapDarkStyle } from '@/constants/mapStyles';
import { useFloodData } from '@/hooks/useFloodData';
import { useLocation } from '@/hooks/useLocation';
import { FloodRiskArea, Region } from '@/types';
import { getRiskStyle } from '@/utils/styleUtils';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<FloodRiskArea | null>(null);
  const { data: floodRiskAreas } = useFloodData();
  const { userLocation, centerOnUser } = useLocation();

  // Malmö, Sweden coordinates
  const [region, setRegion] = useState<Region>({
    latitude: 55.6050,
    longitude: 13.0038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <SafeAreaView className="flex-1 relative">
      <MapView
        className='absolute inset-0'
        region={region}
        onRegionChangeComplete={setRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        customMapStyle={colorScheme === 'dark' ? mapDarkStyle : []}        
        showsUserLocation={true}
        showsMyLocationButton={false}
        accessibilityRole="image"
        accessibilityLabel="Map showing flood risk areas in Malmö, Sweden"
      >
        {floodRiskAreas.map((area) => (
          <React.Fragment key={area.id}>
            <Circle
              center={area.coordinate}
              radius={area.radius}
              fillColor={getRiskStyle(area.riskLevel, 'mapFill')}
              strokeColor={getRiskStyle(area.riskLevel, 'mapStroke')}
              strokeWidth={2}
            />
            <Marker
              coordinate={area.coordinate}
              pinColor={area.riskLevel === 'high' ? 'red' : area.riskLevel === 'medium' ? 'orange' : 'yellow'}
              onPress={() => {
                setSelectedArea(area);
                setModalVisible(true);
              }}
              tracksViewChanges={false}
            />
            

          </React.Fragment>
        ))}

        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            tracksViewChanges={false}
          >
            <View className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-white" />
            </View>
          </Marker>
        )}
      </MapView>

      <TouchableOpacity
        className={`absolute bottom-24 right-4 w-12 h-12 rounded-full justify-center items-center shadow-md ${colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        onPress={() => centerOnUser(setRegion)}
        activeOpacity={0.7}
        accessibilityLabel="Center map on your location"
        accessibilityHint="Tap to center the map on your current location"
        accessibilityRole="button"
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







