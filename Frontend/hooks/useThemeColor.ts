/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/Frontend/constants/Colors';
import { useColorScheme } from '@/Frontend/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme as keyof typeof props];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme as 'light' | 'dark'][colorName];
  }
}


