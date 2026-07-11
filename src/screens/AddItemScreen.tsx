import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "../components/Button";
import Chip from "../components/Chip";
import Input from "../components/Input";
import Screen from "../components/Screen";
import { categories } from "../constants/categories";
import { useLater } from "../context/LaterContext";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import {
  fontFamily,
  typography,
} from "../theme/typography";
import {
  Category,
  Priority,
} from "../types/LaterItem";

const priorities: Priority[] = [
  "Low",
  "Normal",
  "High",
];

const categoryColors: Record<Category, string> = {
  Watch: colors.watch,
  Read: colors.read,
  Eat: colors.eat,
  Go: colors.go,
  Try: colors.try,
  Learn: colors.learn,
  Buy: colors.buy,
};

const categoryEmoji: Record<Category, string> = {
  Watch: "🎬",
  Read: "📚",
  Eat: "🍜",
  Go: "✈️",
  Try: "🎯",
  Learn: "💡",
  Buy: "🛍️",
};

export default function AddItemScreen() {
  const { addItem } = useLater();

  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<Category | null>(null);
  const [priority, setPriority] =
    useState<Priority>("Normal");
  const [note, setNote] = useState("");
  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] =
    useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canSave =
    name.trim().length > 0 &&
    category !== null &&
    !isSaving;

  async function handleSave() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setNameError(
        "Enter something you want to save."
      );
      return;
    }

    if (!category) {
      setCategoryError("Choose a category.");
      return;
    }

    try {
      setIsSaving(true);

      await addItem({
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`,
        name: trimmedName,
        category,
        note: note.trim() || undefined,
        priority,
        status: "Later",
        savedAt: new Date().toISOString(),
        skipCount: 0,
      });

      setName("");
      setCategory(null);
      setPriority("Normal");
      setNote("");
      setNameError("");
      setCategoryError("");

      Alert.alert(
        "Saved ✨",
        `${trimmedName} was added to ${category}.`
      );
    } catch {
      Alert.alert(
        "Could not save",
        "Something went wrong while saving this item."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.eyebrow}>
            SAVE FOR LATER
          </Text>

          <Text style={styles.title}>
            What do you want to save today?
          </Text>

          <Input
            label="What is it?"
            placeholder="Movie, restaurant, book, place..."
            value={name}
            onChangeText={(value) => {
              setName(value);

              if (value.trim()) {
                setNameError("");
              }
            }}
            error={nameError}
            returnKeyType="next"
            maxLength={100}
          />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Category
            </Text>

            <View style={styles.chipWrap}>
              {categories.map((item) => (
                <Chip
                  key={item}
                  label={`${categoryEmoji[item]} ${item}`}
                  selected={category === item}
                  backgroundColor={
                    categoryColors[item]
                  }
                  onPress={() => {
                    setCategory(item);
                    setCategoryError("");
                  }}
                />
              ))}
            </View>

            {categoryError ? (
              <Text style={styles.error}>
                {categoryError}
              </Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Priority
            </Text>

            <View style={styles.chipWrap}>
              {priorities.map((item) => (
                <Chip
                  key={item}
                  label={item}
                  selected={priority === item}
                  backgroundColor={colors.surface}
                  onPress={() => setPriority(item)}
                />
              ))}
            </View>
          </View>

          <Input
            label="Notes"
            placeholder="Optional details or why you saved it..."
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={500}
          />

          <Button
            title={
              isSaving
                ? "Saving..."
                : "Save for Later"
            }
            onPress={handleSave}
            disabled={!canSave}
            style={styles.button}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 120,
    gap: spacing.lg,
  },

  eyebrow: {
    fontFamily: fontFamily.extraBold,
    fontSize: typography.caption,
    letterSpacing: 1.5,
    color: colors.primary,
  },

  title: {
    maxWidth: 320,
    fontFamily: fontFamily.extraBold,
    fontSize: typography.h1,
    lineHeight: 39,
    color: colors.text,
  },

  section: {
    gap: spacing.sm,
  },

  sectionTitle: {
    fontFamily: fontFamily.semibold,
    fontSize: typography.small,
    color: colors.text,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  error: {
    fontFamily: fontFamily.regular,
    fontSize: typography.caption,
    color: colors.danger,
  },

  button: {
    marginTop: spacing.sm,
  },
});