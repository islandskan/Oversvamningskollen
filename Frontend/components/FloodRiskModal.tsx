import React from 'react';
import { TouchableOpacity, View, Text, Modal, ScrollView } from 'react-native';

//#region Interfaces
interface DetailedInfo {
  waterLevel: string;
  probability: string;
  timeframe: string;
  affectedArea: string;
  evacuationStatus: string;
  emergencyContacts: string;
}

interface FloodRiskArea {
  id: number;
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
  radius: number;
  riskLevel: 'high' | 'medium' | 'low' | string;
  detailedInfo: DetailedInfo;
}

interface FloodRiskModalProps {
  visible: boolean;
  selectedArea: FloodRiskArea | null;
  onClose: () => void;
}
//#endregion

export function FloodRiskModal({ visible, selectedArea, onClose }: FloodRiskModalProps) {
  if (!selectedArea) return null;
  
  //#region Helper Functions
  // helper function to get risk color
  const getRiskColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };
  
  // helper function to get text risk color
  const getTextRiskColor = (riskLevel: string) => {
    switch(riskLevel) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      default: return 'text-yellow-600';
    }
  };
  //#endregion
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 dark:bg-black/70">
        <View className="w-[90%] max-h-[80%] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <View className={`p-4 flex-row justify-between items-center ${getRiskColor(selectedArea.riskLevel)}`}>
            <Text className="text-lg font-bold text-white">{selectedArea.title}</Text>
            <TouchableOpacity
              onPress={onClose}
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
              <Text className={`text-base font-bold p-2 rounded text-center mt-1 ${getTextRiskColor(selectedArea.riskLevel)}`}>
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
        </View>
      </View>
    </Modal>
  );
}


