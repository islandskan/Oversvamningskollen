import { TouchableOpacity, View, Text, Modal, ScrollView } from 'react-native';
import { FloodRiskArea } from '@/types';

interface FloodRiskModalProps {
  visible: boolean;
  selectedArea: FloodRiskArea | null;
  onClose: () => void;
}

export function FloodRiskModal({ visible, selectedArea, onClose }: FloodRiskModalProps) {
  if (!selectedArea) return null;

  // Get background and text colors based on risk level
  const getBgColor = (level: string): string => {
    const riskLevel = level.toLowerCase();
    if (riskLevel === 'high') return 'bg-red-500';
    if (riskLevel === 'medium') return 'bg-orange-500';
    if (riskLevel === 'low') return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const getTextColor = (level: string): string => {
    const riskLevel = level.toLowerCase();
    if (riskLevel === 'high') return 'text-red-600';
    if (riskLevel === 'medium') return 'text-orange-600';
    if (riskLevel === 'low') return 'text-yellow-600';
    return 'text-blue-600';
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 dark:bg-black/70">
        <View className="w-[90%] max-h-[80%] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <View className={`p-4 flex-row justify-between items-center ${getBgColor(selectedArea.riskLevel)}`}>
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
              <Text className={`text-base font-bold p-2 rounded text-center mt-1 ${getTextColor(selectedArea.riskLevel)}`}>
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


