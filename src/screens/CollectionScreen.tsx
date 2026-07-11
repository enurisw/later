import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
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
import { Category } from "../types/LaterItem";

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

function formatSavedDate(savedAt: string) {
  const savedDate = new Date(savedAt);
  const now = new Date();

  const difference = now.getTime() - savedDate.getTime();

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (days <= 0) {
    return "Saved today";
  }

  if (days === 1) {
    return "Saved yesterday";
  }

  return `Saved ${days} days ago`;
}

export default function CollectionScreen() {
  const { items, isLoading } = useLater();

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

        return nameMatches || noteMatches;
      });
  }, [items, searchQuery, selectedCategory]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "All";

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
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
                          categoryColors[
                            item.category
                          ],
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        categoryIcons[
                          item.category
                        ]
                      }
                      size={23}
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

                    <Text style={styles.metadata}>
                      {item.category} ·{" "}
                      {item.priority}
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

                <Text style={styles.savedDate}>
                  {formatSavedDate(item.savedAt)}
                </Text>
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
        pressed && styles.filterChipPressed,
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
    paddingBottom: 120,
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

  filterChipPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
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
    width: 52,
    height: 52,
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

  metadata: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    color: colors.textLight,
  },

  note: {
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 23,
    color: colors.text,
  },

  savedDate: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
    color: colors.primary,
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