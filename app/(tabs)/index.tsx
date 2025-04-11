import React, { useState } from 'react';
import { Platform, TouchableOpacity, Alert, StyleSheet, View, Text, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

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
  const [selectedArea, setSelectedArea] = useState<any>(null);
  // Malmö, Sweden coordinates
  const [region, setRegion] = useState({
    latitude: 55.6050,
    longitude: 13.0038,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Sample flood risk areas in Malmö, Sweden (in a real app, this would come from an API)
  const floodRiskAreas = [
    {
      id: 1,
      coordinate: { latitude: 55.6050, longitude: 13.0038 }, // Central Malmö
      title: "High Risk Area",
      description: "Severe flooding expected in central Malmö",
      radius: 800,
      riskLevel: "high",
      detailedInfo: {
        waterLevel: "2.5 meters above normal",
        probability: "75%",
        timeframe: "Next 24-48 hours",
        affectedArea: "Central Malmö, including Stortorget and surrounding streets",
        evacuationStatus: "Evacuation recommended",
        emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
      }
    },
    {
      id: 2,
      coordinate: { latitude: 55.5872, longitude: 12.9701 }, // Near Limhamn
      title: "Medium Risk Area",
      description: "Moderate flooding possible near coastal areas",
      radius: 600,
      riskLevel: "medium",
      detailedInfo: {
        waterLevel: "1.2 meters above normal",
        probability: "50%",
        timeframe: "Next 48-72 hours",
        affectedArea: "Limhamn coastal areas and harbor",
        evacuationStatus: "Be prepared for possible evacuation",
        emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
      }
    },
    {
      id: 3,
      coordinate: { latitude: 55.6204, longitude: 13.0320 }, // Near Kirseberg
      title: "Low Risk Area",
      description: "Minor flooding possible in eastern Malmö",
      radius: 500,
      riskLevel: "low",
      detailedInfo: {
        waterLevel: "0.5 meters above normal",
        probability: "25%",
        timeframe: "Next 3-5 days",
        affectedArea: "Parts of Kirseberg and surrounding low-lying areas",
        evacuationStatus: "No evacuation needed, stay informed",
        emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
      }
    },
    {
      id: 4,
      coordinate: { latitude: 55.5698, longitude: 13.0415 }, // Near Hyllie
      title: "Medium Risk Area",
      description: "Moderate flooding expected in southern Malmö",
      radius: 700,
      riskLevel: "medium",
      detailedInfo: {
        waterLevel: "1.0 meters above normal",
        probability: "60%",
        timeframe: "Next 24-72 hours",
        affectedArea: "Hyllie and surrounding residential areas",
        evacuationStatus: "Be prepared for possible evacuation",
        emergencyContacts: "Emergency Services: 112, Flood Hotline: 040-123456"
      }
    }
  ];


  // Custom map style for dark mode with visible roads
  const mapDarkStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4c5765"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#8a7a66"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

  // Get risk color based on risk level
  const getRiskColor = (riskLevel: 'high' | 'medium' | 'low' | string): string => {
    switch(riskLevel) {
      case 'high': return 'rgba(255, 0, 0, 0.2)';
      case 'medium': return 'rgba(255, 165, 0, 0.2)';
      case 'low': return 'rgba(255, 204, 0, 0.2)'; 
      default: return 'rgba(0, 0, 255, 0.2)';
    }
  };

  // Function to center map on user's location - direct version without confirmation
  const centerOnUser = async () => {
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
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
      Alert.alert('Error', 'Could not get your location. Please try again.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 relative">
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        onRegionChangeComplete={setRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        customMapStyle={colorScheme === 'dark' ? mapDarkStyle : []}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Display flood risk areas */}
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

        {/* Display user location marker only when available */}
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
{/* Center to user location icon  */}
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

      {/* Modal popup for flood risk details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 dark:bg-black/70">
          <View className="w-[90%] max-h-[80%] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            {selectedArea && (
              <>
                <View className={`p-4 flex-row justify-between items-center ${selectedArea.riskLevel === 'high' ? 'bg-red-500' : selectedArea.riskLevel === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`}>
                  <Text className="text-lg font-bold text-white">{selectedArea.title}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="w-8 h-8 rounded-full bg-white/30 justify-center items-center"
                  >
                    <Text className="text-base font-bold text-white">✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView className="p-4">
                  <Text className="text-base mb-4 text-gray-800 dark:text-gray-200">
                    {selectedArea.description}
                  </Text>

                  <View className="h-px bg-gray-300 dark:bg-gray-600 my-3" />

                  <View className="mb-4">
                    <Text className="text-base font-bold mb-2 text-gray-800 dark:text-gray-200">Flood Risk Details</Text>

                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">Water Level:</Text>
                      <Text className="text-sm text-gray-700 dark:text-gray-300 text-right flex-2">{selectedArea.detailedInfo.waterLevel}</Text>
                    </View>

                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">Probability:</Text>
                      <Text className="text-sm text-gray-700 dark:text-gray-300 text-right flex-2">{selectedArea.detailedInfo.probability}</Text>
                    </View>

                    <View className="flex-row justify-between mb-1.5">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">Timeframe:</Text>
                      <Text className="text-sm text-gray-700 dark:text-gray-300 text-right flex-2">{selectedArea.detailedInfo.timeframe}</Text>
                    </View>
                  </View>

                  <View className="mb-4">
                    <Text className="text-base font-bold mb-2 text-gray-800 dark:text-gray-200">Affected Area</Text>
                    <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                      {selectedArea.detailedInfo.affectedArea}
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-base font-bold mb-2 text-gray-800 dark:text-gray-200">Status</Text>
                    <Text className={`text-base font-bold p-2 rounded text-center mt-1 ${selectedArea.riskLevel === 'high' ? 'text-red-600' : selectedArea.riskLevel === 'medium' ? 'text-orange-600' : 'text-yellow-600'}`}>
                      {selectedArea.detailedInfo.evacuationStatus}
                    </Text>
                  </View>

                  <View className="mb-4">
                    <Text className="text-base font-bold mb-2 text-gray-800 dark:text-gray-200">Emergency Contacts</Text>
                    <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                      {selectedArea.detailedInfo.emergencyContacts}
                    </Text>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


