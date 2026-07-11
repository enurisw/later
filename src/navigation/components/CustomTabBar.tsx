import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Check,
  Folder,
  House,
  Plus,
  User,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { shadows } from "../../theme/shadows";
import { spacing } from "../../theme/spacing";
import {
  fontFamily,
  typography,
} from "../../theme/typography";

const tabIcons = {
  Home: House,
  Collection: Folder,
  Done: Check,
  Profile: User,
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key].options;

          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : route.name;

          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const handleLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          if (route.name === "Add") {
            return (
              <View key={route.key} style={styles.addSlot}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={
                    isFocused ? { selected: true } : {}
                  }
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onPress={handlePress}
                  onLongPress={handleLongPress}
                  style={({ pressed }) => [
                    styles.addButton,
                    isFocused && styles.addButtonFocused,
                    pressed && styles.pressed,
                  ]}
                >
                  <Plus
                    size={30}
                    strokeWidth={2.5}
                    color={colors.surface}
                  />
                </Pressable>
              </View>
            );
          }

          const Icon =
            tabIcons[route.name as keyof typeof tabIcons];

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={
                isFocused ? { selected: true } : {}
              }
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={handlePress}
              onLongPress={handleLongPress}
              style={({ pressed }) => [
                styles.tabButton,
                isFocused && styles.activeTab,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                size={21}
                strokeWidth={isFocused ? 2.5 : 2}
                color={
                  isFocused
                    ? colors.primary
                    : colors.textLight
                }
              />

              {isFocused ? (
                <Text style={styles.activeLabel}>
                  {label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },

  tabBar: {
    height: 72,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows,
  },

  tabButton: {
    minWidth: 52,
    height: 46,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
  },

  activeTab: {
    backgroundColor: colors.accent,
  },

  activeLabel: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
    color: colors.primary,
  },

  addSlot: {
    width: 64,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    width: 60,
    height: 60,
    marginTop: -28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: colors.background,
    ...shadows,
  },

  addButtonFocused: {
    transform: [{ scale: 1.05 }],
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});