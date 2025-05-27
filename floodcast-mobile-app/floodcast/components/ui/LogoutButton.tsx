import { View, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from './IconSymbol';

interface LogoutButtonProps {
  onPress: () => void;
}

export const LogoutButton = ({ onPress }: LogoutButtonProps) => (
  <View className="my-8 ">
    <TouchableOpacity
      className="rounded-3xl overflow-hidden "
      onPress={onPress}
      accessibilityLabel="Log out"
      accessibilityHint="Tap to log out of your account"
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#ef4444', '#b91c1c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 0.85 }}
        className="py-3 px-4 items-center flex-row justify-center"
      >
        <IconSymbol
          name="rectangle.portrait.and.arrow.right"
          size={20}
          color="white"
        />
        <Text className="text-white font-bold text-lg ml-2">Log Out</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);