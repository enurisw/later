import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Later</Text>

      <Text style={styles.title}>What do you feel like doing?</Text>

      <Text style={styles.subtitle}>
        Save it now. Do it later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#F8F6F1",
  },

  logo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 40,
  },

  title: {
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 44,
  },

  subtitle: {
    marginTop: 16,
    fontSize: 18,
    color: "#666666",
  },
});