import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Card from "../components/Card";
import Screen from "../components/Screen";
import { categories } from "../constants/categories";
import { useLater } from "../context/LaterContext";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import {
  fontFamily,
  typography,
} from "../theme/typography";
import { Category, LaterItem } from "../types/LaterItem";

type CategoryFilter = "All" | Category;

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

function formatCompletedDate(completedAt?: string) {
  if (!completedAt) {
    return "Completed recently";
  }

  const completedDate = new Date(completedAt);
  const now = new Date();

  const difference = now.getTime() - completedDate.getTime();

  const days = Math.max(
    0,
    Math.floor(difference / (1000 * 60 * 60 * 24))
  );

  if (days === 0) {
    return "Completed today";
  }

  if (days === 1) {
    return "Completed yesterday";
  }

  if (days < 7) {
    return `Completed ${days} days ago`;
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7);

    return `Completed ${weeks} ${
      weeks === 1 ? "week" : "weeks"
    } ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `Completed ${months} ${
      months === 1 ? "month" : "months"
    } ago`;
  }

  const years = Math.floor(months / 12);

  return `Completed ${years} ${
    years === 1 ? "year" : "years"
  } ago`;
}

export default function DoneScreen() {
  const { items, isLoading, updateItem, deleteItem } =
    useLater();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");

  const doneItems = useMemo(() => {
    return items
      .filter((item) => item.status === "Done")
      .sort((firstItem, secondItem) => {
        const firstDate = firstItem.completedAt
          ? new Date(firstItem.completedAt).getTime()
          : 0;

        const secondDate = secondItem.completedAt
          ? new Date(secondItem.completedAt).getTime()
          : 0;

        return secondDate - firstDate;
      });
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return doneItems
      .filter((item) => {
        if (selectedCategory === "All") {
          return true;
        }

        return item.category === selectedCategory;
      })
      .filter((item) => {
        if (!normalizedQuery) {
          return true;
        }

        const nameMatches = item.name
          .toLowerCase()
          .includes(normalizedQuery);

        const noteMatches = item.note
          ?.toLowerCase()
          .includes(normalizedQuery);

        return Boolean(nameMatches || noteMatches);
      });
  }, [doneItems, searchQuery, selectedCategory]);

  const totalTrackedItems = items.filter(
    (item) =>
      item.status === "Later" ||
      item.status === "Doing" ||
      item.status === "Done"
  ).length;

  const completionPercentage =
    totalTrackedItems === 0
      ? 0
      : Math.round(
          (doneItems.length / totalTrackedItems) * 100
        );

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "All";

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
  }

  async function moveBackToLater(item: LaterItem) {
    try {
      await updateItem({
        ...item,
        status: "Later",
        completedAt: undefined,
      });
    } catch {
      Alert.alert(
        "Could not update item",
        "Please try again."
      );
    }
  }

  function confirmMoveBack(item: LaterItem) {
    Alert.alert(
      "Move back to Later?",
      `"${item.name}" will return to your saved collection.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Move Back",
          onPress: () => {
            void moveBackToLater(item);
          },
        },
      ]
    );
  }

  function confirmDelete(item: LaterItem) {
    Alert.alert(
      "Delete completed item?",
      `"${item.name}" will be permanently removed.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void deleteItem(item.id);
          },
        },
      ]
    );
  }

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>
          YOUR COMPLETED COLLECTION
        </Text>

        <Text style={styles.title}>
          Things I finally did
        </Text>

        <Text style={styles.subtitle}>
          A little reminder that your saved ideas do not
          have to stay saved forever.
        </Text>

        <Card style={styles.progressCard}>
          <View style={styles.progressTopRow}>
            <View style={styles.celebrationIcon}>
              <Ionicons
                name="trophy-outline"
                size={28}
                color={colors.text}
              />
            </View>

            <View style={styles.progressText}>
              <Text style={styles.progressNumber}>
                {doneItems.length}
              </Text>

              <Text style={styles.progressLabel}>
                {doneItems.length === 1
                  ? "thing completed"
                  : "things completed"}
              </Text>
            </View>

            <Text style={styles.percentage}>
              {completionPercentage}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${completionPercentage}%`,
                },
              ]}
            />
          </View>

          <Text style={styles.progressCaption}>
            {totalTrackedItems === 0
              ? "Save something to begin your Later journey."
              : `${doneItems.length} of ${totalTrackedItems} saved experiences completed.`}
          </Text>
        </Card>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textLight}
          />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search completed items"
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />

          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery("")}
              hitSlop={10}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textLight}
              />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          <FilterChip
            label="All"
            selected={selectedCategory === "All"}
            backgroundColor={colors.accent}
            onPress={() => setSelectedCategory("All")}
          />

          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              selected={selectedCategory === category}
              backgroundColor={categoryColors[category]}
              onPress={() =>
                setSelectedCategory(category)
              }
            />
          ))}
        </ScrollView>

        <View style={styles.resultsHeader}>
          <Text style={styles.count}>
            {filteredItems.length}{" "}
            {filteredItems.length === 1
              ? "completed item"
              : "completed items"}
          </Text>

          {hasActiveFilters ? (
            <Pressable onPress={clearFilters}>
              <Text style={styles.clearText}>
                Clear filters
              </Text>
            </Pressable>
          ) : null}
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              Loading completed items...
            </Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.center}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name={
                  hasActiveFilters
                    ? "search-outline"
                    : "checkmark-circle-outline"
                }
                size={44}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {hasActiveFilters
                ? "No matching items"
                : "Nothing completed yet"}
            </Text>

            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? "Try another search or choose a different category."
                : "When you finish something from your Later collection, it will appear here."}
            </Text>

            {hasActiveFilters ? (
              <Pressable
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>
                  Show all completed items
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                style={styles.itemCard}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        backgroundColor:
                          categoryColors[item.category],
                      },
                    ]}
                  >
                    <Ionicons
                      name={categoryIcons[item.category]}
                      size={24}
                      color={colors.text}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <Text
                      style={styles.itemName}
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>

                    <Text style={styles.completedDate}>
                      {formatCompletedDate(
                        item.completedAt
                      )}
                    </Text>
                  </View>

                  <View style={styles.doneMark}>
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={colors.surface}
                    />
                  </View>
                </View>

                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor:
                          categoryColors[item.category],
                      },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {item.category}
                    </Text>
                  </View>

                  <View style={styles.priorityBadge}>
                    <Text style={styles.badgeText}>
                      {item.priority} priority
                    </Text>
                  </View>
                </View>

                {item.note ? (
                  <Text
                    style={styles.note}
                    numberOfLines={3}
                  >
                    {item.note}
                  </Text>
                ) : null}

                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => confirmMoveBack(item)}
                    style={({ pressed }) => [
                      styles.moveBackButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="arrow-undo-outline"
                      size={19}
                      color={colors.text}
                    />

                    <Text style={styles.moveBackText}>
                      Move Back
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => confirmDelete(item)}
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.danger}
                    />
                  </Pressable>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

interface FilterChipProps {
  label: string;
  selected: boolean;
  backgroundColor: string;
  onPress: () => void;
}

function FilterChip({
  label,
  selected,
  backgroundColor,
  onPress,
}: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterChip,
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
          styles.filterChipText,
          selected && styles.filterChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 130,
  },

  eyebrow: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.caption,
    letterSpacing: 1.5,
    color: colors.primary,
  },

  title: {
    marginTop: spacing.sm,
    maxWidth: 340,
    fontFamily: fontFamily.semibold,
    fontSize: typography.display,
    lineHeight: 44,
    color: colors.text,
  },

  subtitle: {
    marginTop: spacing.md,
    maxWidth: 340,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 24,
    color: colors.textLight,
  },

  progressCard: {
    marginTop: spacing.xl,
    gap: spacing.md,
    backgroundColor: colors.accent,
  },

  progressTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  celebrationIcon: {
    width: 54,
    height: 54,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
  },

  progressText: {
    flex: 1,
  },

  progressNumber: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.heading,
    color: colors.text,
  },

  progressLabel: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },

  percentage: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.subheading,
    color: colors.primary,
  },

  progressTrack: {
    height: 10,
    overflow: "hidden",
    borderRadius: radius.full,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },

  progressFill: {
    height: "100%",
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },

  progressCaption: {
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    lineHeight: 20,
    color: colors.textLight,
  },

  searchContainer: {
    minHeight: 52,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    color: colors.text,
  },

  filterRow: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },

  filterChip: {
    minHeight: 38,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },

  filterChipText: {
    fontFamily: fontFamily.medium,
    fontSize: typography.small,
    color: colors.text,
  },

  filterChipTextSelected: {
    color: colors.surface,
  },

  resultsHeader: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  count: {
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    color: colors.textLight,
  },

  clearText: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
    color: colors.primary,
  },

  list: {
    gap: spacing.md,
  },

  itemCard: {
    gap: spacing.md,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flex: 1,
  },

  itemName: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.subheading,
    lineHeight: 25,
    color: colors.text,
  },

  completedDate: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },

  doneMark: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },

  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  badgeText: {
    fontFamily: fontFamily.medium,
    fontSize: typography.small,
    color: colors.text,
  },

  note: {
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 23,
    color: colors.textLight,
  },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  moveBackButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },

  moveBackText: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
    color: colors.text,
  },

  deleteButton: {
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

  center: {
    flexGrow: 1,
    minHeight: 340,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },

  emptyIcon: {
    width: 88,
    height: 88,
    marginBottom: spacing.lg,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
  },

  emptyTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.heading,
    textAlign: "center",
    color: colors.text,
  },

  emptyText: {
    marginTop: spacing.sm,
    maxWidth: 290,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 24,
    textAlign: "center",
    color: colors.textLight,
  },

  clearButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },

  clearButtonText: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
    color: colors.surface,
  },
});