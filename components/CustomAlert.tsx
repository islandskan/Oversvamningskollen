import { View, Text, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useNotificationStore } from '@/store/useNotificationStore';

export default function CustomAlert() {
  const { activeAlert, isAlertVisible, hideAlert } = useNotificationStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!activeAlert || !isAlertVisible) return null;

  
  const handleInnerPress = () => {
    // This prevents the parent's onPress from firing when pressing the inner content
    // This is useful when the modal is nested within other pressable components
  };


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isAlertVisible}
      onRequestClose={hideAlert}
      accessibilityViewIsModal={true}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={hideAlert}
        accessibilityLabel="Alert backdrop"
        accessibilityHint="Tap anywhere outside the alert to dismiss it"
        accessibilityRole="button"
      >
        <Pressable
          className={`w-[80%] rounded-2xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          onPress={handleInnerPress}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {activeAlert.title}
            </Text>
            <Pressable
              onPress={hideAlert}
              className={`w-8 h-8 rounded-full items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
              accessibilityLabel="Close alert"
              accessibilityHint="Tap to dismiss this alert"
              accessibilityRole="button"
            >
              <MaterialIcons
                name="close"
                size={20}
                color={isDark ? '#ffffff' : '#1a202c'}
              />
            </Pressable>
          </View>

          <Text
            className={`mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}
          >
            {activeAlert.message}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

