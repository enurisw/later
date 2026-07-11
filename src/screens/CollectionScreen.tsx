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
import { formatSavedAge } from "../lib/date";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import {
  fontFamily,
  typography,
} from "../theme/typography";
import {
  Category,
  LaterItem,
} from "../types/LaterItem";

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

export default function CollectionScreen() {
  const {
    items,
    isLoading,
    updateItem,
    deleteItem,
  } = useLater();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery
      .trim()
      .toLowerCase();

    return items
      .filter((item) => item.status === "Later")
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
  }, [items, searchQuery, selectedCategory]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "All";

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
  }

  async function handleMarkDone(item: LaterItem) {
    try {
      await updateItem({
        ...item,
        status: "Done",
        completedAt: new Date().toISOString(),
      });
    } catch {
      Alert.alert(
        "Could not update item",
        "Please try again."
      );
    }
  }

  function confirmMarkDone(item: LaterItem) {
    Alert.alert(
      "Mark as done?",
      `Move "${item.name}" to Things I Finally Did?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Mark Done",
          onPress: () => {
            void handleMarkDone(item);
          },
        },
      ]
    );
  }

  function confirmDelete(item: LaterItem) {
    Alert.alert(
      "Delete this item?",
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
          YOUR COLLECTION
        </Text>

        <Text style={styles.title}>
          Things saved for later
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={colors.textLight}
          />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search your saved items"
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />

          {searchQuery.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
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
            onPress={() =>
              setSelectedCategory("All")
            }
          />

          {categories.map((category) => (
            <FilterChip
              key={category}
              label={category}
              selected={
                selectedCategory === category
              }
              backgroundColor={
                categoryColors[category]
              }
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
              ? "item"
              : "items"}
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
              Loading your collection...
            </Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.center}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name={
                  hasActiveFilters
                    ? "search-outline"
                    : "albums-outline"
                }
                size={42}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {hasActiveFilters
                ? "No matching items"
                : "Nothing saved yet"}
            </Text>

            <Text style={styles.emptyText}>
              {hasActiveFilters
                ? "Try another search or choose a different category."
                : "Add a movie, restaurant, book, place, or anything else you want to rediscover later."}
            </Text>

            {hasActiveFilters ? (
              <Pressable
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>
                  Show all items
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.list}>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          categoryColors[item.category],
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        categoryIcons[item.category]
                      }
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

                    <Text style={styles.savedAge}>
                      {formatSavedAge(item.savedAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.badge,
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
                    <Text style={styles.priorityText}>
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
                    accessibilityRole="button"
                    accessibilityLabel={`Mark ${item.name} as done`}
                    onPress={() =>
                      confirmMarkDone(item)
                    }
                    style={({ pressed }) => [
                      styles.doneButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color={colors.text}
                    />

                    <Text style={styles.doneButtonText}>
                      Mark Done
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${item.name}`}
                    onPress={() =>
                      confirmDelete(item)
                    }
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
          selected &&
            styles.filterChipTextSelected,
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

  card: {
    gap: spacing.md,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  iconContainer: {
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

  savedAge: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
    color: colors.textLight,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },

  badgeText: {
    fontFamily: fontFamily.medium,
    fontSize: typography.small,
    color: colors.text,
  },

  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },

  priorityText: {
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

  doneButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },

  doneButtonText: {
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
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },

  emptyIcon: {
    width: 84,
    height: 84,
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