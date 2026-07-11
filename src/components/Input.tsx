import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  multiline,
  style,
  ...props
}: InputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.textLight}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          style,
        ]}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },

  label: {
    fontSize: typography.small,
    fontWeight: "600",
    color: colors.text,
  },

  input: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
  },

  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },

  inputError: {
    borderColor: colors.danger,
  },

  error: {
    fontSize: typography.caption,
    color: colors.danger,
  },
});