import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { shadows } from "../theme/shadows";
import { spacing } from "../theme/spacing";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows,
  },
});