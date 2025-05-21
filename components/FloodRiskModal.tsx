import { View, Text, Modal, ScrollView, Pressable } from 'react-native';
import { FloodRiskArea } from '@/types';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  ActionButton,
  DetailItem,
  DetailSection,
  RiskGauge,
  RiskHeader
} from './flood-risk-modal';

interface FloodRiskModalProps {
  visible: boolean;
  selectedArea: FloodRiskArea | null;
  onClose: () => void;
}

export function FloodRiskModal({ visible, selectedArea, onClose }: FloodRiskModalProps) {
  const colorScheme = useColorScheme();

  if (!selectedArea) return null;

  const getTextColor = (level: string): string => {
    const riskLevel = level.toLowerCase();
    if (riskLevel === 'high') return 'text-red-600';
    if (riskLevel === 'medium') return 'text-orange-600';
    if (riskLevel === 'low') return 'text-yellow-600';
    return 'text-blue-600';
  };

  const handleEmergencyCall = () => {
    // Handle emergency call logic
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/50 dark:bg-black/70"
        onPress={onClose}
      >
        <Pressable
          className="w-[90%] max-h-[80%] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <RiskHeader
            title={selectedArea.title}
            riskLevel={selectedArea.riskLevel}
            onClose={onClose}
          />

          <ScrollView className="p-4">
            <Text className="text-base mb-4 text-gray-800 dark:text-gray-200">
              {selectedArea.description}
            </Text>

            <RiskGauge riskLevel={selectedArea.riskLevel} />

            <View className="h-px bg-gray-300 dark:bg-gray-600 my-3" />

            <DetailSection
              title="Flood Risk Details"
              iconName="information-circle"
              colorScheme={colorScheme}
            >
              <DetailItem
                iconName="water"
                label="Water Level:"
                value={selectedArea.detailedInfo.waterLevel}
                colorScheme={colorScheme}
              />
              <DetailItem
                iconName="stats-chart"
                label="Probability:"
                value={selectedArea.detailedInfo.probability}
                colorScheme={colorScheme}
              />
              <DetailItem
                iconName="time"
                label="Timeframe:"
                value={selectedArea.detailedInfo.timeframe}
                colorScheme={colorScheme}
              />
            </DetailSection>

            <DetailSection
              title="Affected Area"
              iconName="location"
              colorScheme={colorScheme}
            >
              <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                {selectedArea.detailedInfo.affectedArea}
              </Text>
            </DetailSection>

            <DetailSection
              title="Status"
              iconName="warning"
              colorScheme={colorScheme}
            >
              <Text className={`text-base font-bold p-2 rounded text-center mt-1 ${getTextColor(selectedArea.riskLevel)}`}>
                {selectedArea.detailedInfo.evacuationStatus}
              </Text>
            </DetailSection>

            <DetailSection
              title="Emergency Contacts"
              iconName="call"
              colorScheme={colorScheme}
            >
              <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                {selectedArea.detailedInfo.emergencyContacts}
              </Text>
            </DetailSection>

            <ActionButton
              label="Call For Help"
              riskLevel={selectedArea.riskLevel}
              iconName="call"
              onPress={handleEmergencyCall}
            />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}


