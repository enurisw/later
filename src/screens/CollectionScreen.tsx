import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Card from "../components/Card";
import Screen from "../components/Screen";
import { useLater } from "../context/LaterContext";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import {
  fontFamily,
  typography,
} from "../theme/typography";
import { Category } from "../types/LaterItem";

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

  const difference =
    now.getTime() - savedDate.getTime();

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

  const laterItems = items.filter(
    (item) => item.status === "Later"
  );

  return (
    <Screen>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>
          YOUR COLLECTION
        </Text>

        <Text style={styles.title}>
          Things saved for later
        </Text>

        <Text style={styles.count}>
          {laterItems.length}{" "}
          {laterItems.length === 1
            ? "item"
            : "items"}
        </Text>

        {isLoading ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              Loading your collection...
            </Text>
          </View>
        ) : laterItems.length === 0 ? (
          <View style={styles.center}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="albums-outline"
                size={42}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nothing saved yet
            </Text>

            <Text style={styles.emptyText}>
              Add a movie, restaurant, book,
              place, or anything else you want
              to rediscover later.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {laterItems.map((item) => (
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
                      size={22}
                      color={colors.text}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.itemName}>
                      {item.name}
                    </Text>

                    <Text style={styles.metadata}>
                      {item.category} ·{" "}
                      {item.priority}
                    </Text>
                  </View>
                </View>

                {item.note ? (
                  <Text style={styles.note}>
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
    fontFamily: fontFamily.extraBold,
    fontSize: typography.caption,
    letterSpacing: 1.5,
    color: colors.primary,
  },

  title: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.extraBold,
    fontSize: typography.h1,
    lineHeight: 39,
    color: colors.text,
  },

  count: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    color: colors.textLight,
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
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flex: 1,
  },

  itemName: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.h3,
    color: colors.text,
  },

  metadata: {
    marginTop: spacing.xs,
    fontFamily: fontFamily.regular,
    fontSize: typography.small,
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
    fontSize: typography.caption,
    color: colors.primary,
  },

  center: {
    flexGrow: 1,
    minHeight: 380,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },

  emptyIcon: {
    width: 84,
    height: 84,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.secondary,
    marginBottom: spacing.lg,
  },

  emptyTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: typography.h2,
    color: colors.text,
  },

  emptyText: {
    marginTop: spacing.sm,
    maxWidth: 290,
    textAlign: "center",
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    lineHeight: 24,
    color: colors.textLight,
  },
});