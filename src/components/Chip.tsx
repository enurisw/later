import {
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import {
  fontFamily,
  typography,
} from "../theme/typography";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  backgroundColor?: string;
}

export default function Chip({
  label,
  selected = false,
  onPress,
  backgroundColor = colors.surface,
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected
            ? colors.primary
            : backgroundColor,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected
            ? styles.selectedLabel
            : styles.defaultLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pressed: {
    opacity: 0.8,
  },

  label: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
  },

  selectedLabel: {
    color: colors.surface,
  },

  defaultLabel: {
    color: colors.text,
  },
});