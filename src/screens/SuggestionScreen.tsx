import { Ionicons } from "@expo/vector-icons";
import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "../components/Button";
import Card from "../components/Card";
import Screen from "../components/Screen";
import { useLater } from "../context/LaterContext";
import { formatSavedAge } from "../lib/date";
import { getWeightedSuggestion } from "../lib/suggestion";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import {
  fontFamily,
  typography,
} from "../theme/typography";
import { Category, LaterItem } from "../types/LaterItem";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Suggestion"
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

export default function SuggestionScreen({
  navigation,
  route,
}: Props) {
  const { items, updateItem } = useLater();

  const category = route.params?.category;
  const [suggestion, setSuggestion] =
    useState<LaterItem | null>(null);
  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    const firstSuggestion = getWeightedSuggestion(
      items,
      category
    );

    setSuggestion(firstSuggestion);

    if (firstSuggestion) {
      setSeenIds([firstSuggestion.id]);
    }
  }, [category, items]);

  async function markAsSuggested(item: LaterItem) {
    await updateItem({
      ...item,
      lastSuggested: new Date().toISOString(),
    });
  }

  async function handleAnotherOne() {
    if (!suggestion) {
      return;
    }

    await markAsSuggested(suggestion);

    let nextSuggestion = getWeightedSuggestion(
      items,
      category,
      seenIds
    );

    if (!nextSuggestion) {
      nextSuggestion = getWeightedSuggestion(
        items,
        category,
        [suggestion.id]
      );
    }

    if (!nextSuggestion) {
      nextSuggestion = suggestion;
    }

    setSuggestion(nextSuggestion);

    setSeenIds((currentIds) =>
      currentIds.includes(nextSuggestion.id)
        ? currentIds
        : [...currentIds, nextSuggestion.id]
    );
  }

  async function handleNotToday() {
    if (!suggestion) {
      return;
    }

    await updateItem({
      ...suggestion,
      skipCount: suggestion.skipCount + 1,
      lastSuggested: new Date().toISOString(),
    });

    handleAnotherOne();
  }

  async function handleDoIt() {
    if (!suggestion) {
      return;
    }

    await updateItem({
      ...suggestion,
      status: "Doing",
      lastSuggested: new Date().toISOString(),
    });

    navigation.goBack();
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.text}
          />
        </Pressable>

        <Text style={styles.eyebrow}>
          {category
            ? `${category.toUpperCase()} SUGGESTION`
            : "YOUR SUGGESTION"}
        </Text>

        <Text style={styles.title}>Maybe today?</Text>

        {suggestion ? (
          <Card style={styles.suggestionCard}>
            <View
              style={[
                styles.categoryIcon,
                {
                  backgroundColor:
                    categoryColors[suggestion.category],
                },
              ]}
            >
              <Ionicons
                name={categoryIcons[suggestion.category]}
                size={38}
                color={colors.text}
              />
            </View>

            <Text style={styles.itemName}>
              {suggestion.name}
            </Text>

            <View style={styles.metadataRow}>
              <Text style={styles.category}>
                {suggestion.category}
              </Text>

              <View style={styles.dot} />

              <Text style={styles.savedAge}>
                {formatSavedAge(suggestion.savedAt)}
              </Text>
            </View>

            {suggestion.note ? (
              <Text style={styles.note}>
                {suggestion.note}
              </Text>
            ) : null}

            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>
                {suggestion.priority} priority
              </Text>
            </View>
          </Card>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="sparkles-outline"
                size={42}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nothing to suggest yet
            </Text>

            <Text style={styles.emptyText}>
              {category
                ? `Save something in ${category} first.`
                : "Save a few things first and Later will help you choose."}
            </Text>
          </View>
        )}

        {suggestion ? (
          <View style={styles.actions}>
            <Button
              title="Do It"
              onPress={handleDoIt}
            />

            <Button
              title="Another One"
              variant="secondary"
              onPress={handleAnotherOne}
            />

            <Pressable
              onPress={handleNotToday}
              style={({ pressed }) => [
                styles.notTodayButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.notTodayText}>
                Not Today
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },

  backButton: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  eyebrow: {
    marginTop: spacing.xl,
    fontFamily: fontFamily.semibold,
    fontSize: typography.caption,
    letterSpacing: 1.4,
    color: colors.primary,
  },

  title: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.semibold,
    fontSize: typography.display,
    lineHeight: 44,
    color: colors.text,
  },

  suggestionCard: {
    marginTop: spacing.xl,
    alignItems: "center",
    gap: spacing.md,
  },

  categoryIcon: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },

  itemName: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.semibold,
    fontSize: typography.heading,
    lineHeight: 36,
    textAlign: "center",
    color: colors.text,
  },

  metadataRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },

  category: {
    fontFamily: fontFamily.medium,
    fontSize: typography.small,
    color: colors.text,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.textLight,
  },

  savedAge: {
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },

  note: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: "center",
    color: colors.textLight,
  },

  priorityBadge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },

  priorityText: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
    color: colors.text,
  },

  actions: {
    marginTop: "auto",
    gap: spacing.md,
  },

  notTodayButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  notTodayText: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.body,
    color: colors.textLight,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },

  emptyIcon: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },

  emptyTitle: {
    marginTop: spacing.lg,
    fontFamily: fontFamily.semibold,
    fontSize: typography.heading,
    textAlign: "center",
    color: colors.text,
  },

  emptyText: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: "center",
    color: colors.textLight,
  },
});