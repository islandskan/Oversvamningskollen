import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton = ({ onPress }: LogoutButtonProps) => (
  <View className="my-8">
    <TouchableOpacity
      className="rounded-xl overflow-hidden"
      onPress={onPress}
    >
      <LinearGradient
        colors={['#ef4444', '#b91c1c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.866 }}
        className="py-3 px-4 items-center"
      >
        <Text className="text-white font-semibold text-base">Log Out</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);