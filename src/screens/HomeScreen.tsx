import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "../components/Button";
import Card from "../components/Card";
import Screen from "../components/Screen";
import { categories } from "../constants/categories";
import { useLater } from "../context/LaterContext";
import {
  RootStackParamList,
  RootTabParamList,
} from "../navigation/AppNavigator";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import {
  fontFamily,
  typography,
} from "../theme/typography";
import { Category } from "../types/LaterItem";

type HomeNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

const categoryColors: Record<Category, string> = {
  Watch: colors.watch,
  Read: colors.read,
  Eat: colors.eat,
  Go: colors.go,
  Try: colors.try,
  Learn: colors.learn,
  Buy: colors.buy,
};

const categoryIcons: Record<
  Category,
  keyof typeof Ionicons.glyphMap
> = {
  Watch: "film-outline",
  Read: "book-outline",
  Eat: "restaurant-outline",
  Go: "location-outline",
  Try: "sparkles-outline",
  Learn: "school-outline",
  Buy: "bag-handle-outline",
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return {
      text: "Good morning",
      icon: "sunny-outline" as const,
    };
  }

  if (hour < 18) {
    return {
      text: "Good afternoon",
      icon: "partly-sunny-outline" as const,
    };
  }

  return {
    text: "Good evening",
    icon: "moon-outline" as const,
  };
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeNavigationProp>();
  const { items } = useLater();

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const greeting = getGreeting();

  const laterItems = useMemo(
    () => items.filter((item) => item.status === "Later"),
    [items]
  );

  const doneItems = useMemo(
    () => items.filter((item) => item.status === "Done"),
    [items]
  );

  const selectedCount = selectedCategory
    ? laterItems.filter(
        (item) => item.category === selectedCategory
      ).length
    : laterItems.length;

  function handleCategoryPress(category: Category) {
    setSelectedCategory((currentCategory) =>
      currentCategory === category ? null : category
    );
  }

  function handleSuggestionPress() {
    navigation.navigate("Suggestion", {
      category: selectedCategory ?? undefined,
    });
  }

  function getCategoryCount(category: Category) {
    return laterItems.filter(
      (item) => item.category === category
    ).length;
  }

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.brand}>Later</Text>

            <View style={styles.greetingRow}>
              <Ionicons
                name={greeting.icon}
                size={18}
                color={colors.primary}
              />

              <Text style={styles.greeting}>
                {greeting.text}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={() => navigation.navigate("Profile")}
            style={({ pressed }) => [
              styles.profileButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={22}
              color={colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            REDISCOVER SOMETHING
          </Text>

          <Text style={styles.title}>
            What do you feel like doing today?
          </Text>

          <Text style={styles.subtitle}>
            Choose a category and Later will help you
            rediscover something you saved.
          </Text>
        </View>

        <View style={styles.categoryGrid}>
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category;

            const categoryCount =
              getCategoryCount(category);

            return (
              <Pressable
                key={category}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                }}
                accessibilityLabel={`${category}, ${categoryCount} saved`}
                onPress={() =>
                  handleCategoryPress(category)
                }
                style={({ pressed }) => [
                  styles.categoryCard,
                  {
                    backgroundColor:
                      categoryColors[category],
                  },
                  isSelected &&
                    styles.categoryCardSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons
                    name={categoryIcons[category]}
                    size={26}
                    color={colors.text}
                  />
                </View>

                <Text style={styles.categoryName}>
                  {category}
                </Text>

                <Text style={styles.categoryCount}>
                  {categoryCount}{" "}
                  {categoryCount === 1
                    ? "item"
                    : "items"}
                </Text>

                {isSelected ? (
                  <View style={styles.selectedMark}>
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={colors.surface}
                    />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <Card style={styles.suggestionCard}>
          <View style={styles.suggestionTopRow}>
            <View style={styles.sparkleIcon}>
              <Ionicons
                name="sparkles"
                size={23}
                color={colors.text}
              />
            </View>

            <View style={styles.suggestionText}>
              <Text style={styles.suggestionEyebrow}>
                PICK SOMETHING FOR ME
              </Text>

              <Text style={styles.suggestionTitle}>
                {selectedCategory
                  ? `${selectedCount} ${
                      selectedCategory
                    } ${
                      selectedCount === 1
                        ? "idea"
                        : "ideas"
                    } waiting`
                  : `${laterItems.length} saved ${
                      laterItems.length === 1
                        ? "idea"
                        : "ideas"
                    } waiting`}
              </Text>
            </View>
          </View>

          <Text style={styles.suggestionBody}>
            {laterItems.length === 0
              ? "Save a few things first, then Later can help you choose."
              : selectedCategory
                ? `Get a suggestion from your ${selectedCategory} collection.`
                : "Let Later rediscover something you may have forgotten."}
          </Text>

          <Button
            title={
              selectedCategory
                ? `Pick from ${selectedCategory}`
                : "Pick Something For Me"
            }
            onPress={handleSuggestionPress}
            disabled={selectedCount === 0}
          />
        </Card>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {laterItems.length}
            </Text>

            <Text style={styles.statLabel}>
              Saved
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {doneItems.length}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {
                new Set(
                  laterItems.map(
                    (item) => item.category
                  )
                ).size
              }
            </Text>

            <Text style={styles.statLabel}>
              Categories
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 130,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brand: {
    fontFamily: fontFamily.extraBold,
    fontSize: typography.heading,
    color: colors.text,
  },

  greetingRow: {
    marginTop: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  greeting: {
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  hero: {
    marginTop: spacing.xl,
  },

  eyebrow: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.caption,
    letterSpacing: 1.4,
    color: colors.primary,
  },

  title: {
    marginTop: spacing.sm,
    maxWidth: 350,
    fontFamily: fontFamily.semibold,
    fontSize: typography.display,
    lineHeight: 44,
    color: colors.text,
  },

  subtitle: {
    marginTop: spacing.md,
    maxWidth: 330,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 23,
    color: colors.textLight,
  },

  categoryGrid: {
    marginTop: spacing.xl,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: spacing.md,
  },

  categoryCard: {
    width: "48%",
    minHeight: 145,
    padding: spacing.md,
    borderRadius: radius.lg,
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "transparent",
  },

  categoryCardSelected: {
    borderColor: colors.primary,
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },

  categoryName: {
    marginTop: spacing.md,
    fontFamily: fontFamily.semibold,
    fontSize: typography.subheading,
    color: colors.text,
  },

  categoryCount: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },

  selectedMark: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  suggestionCard: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },

  suggestionTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  sparkleIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },

  suggestionText: {
    flex: 1,
  },

  suggestionEyebrow: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.caption,
    letterSpacing: 1,
    color: colors.primary,
  },

  suggestionTitle: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.semibold,
    fontSize: typography.subheading,
    lineHeight: 25,
    color: colors.text,
  },

  suggestionBody: {
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 23,
    color: colors.textLight,
  },

  statsRow: {
    marginTop: spacing.xl,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.heading,
    color: colors.text,
  },

  statLabel: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },

  divider: {
    width: 1,
    height: 38,
    backgroundColor: colors.border,
  },
});