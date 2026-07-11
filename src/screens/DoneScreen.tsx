import { StyleSheet, Text, View } from "react-native";

export default function DoneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Things I Finally Did</Text>
      <Text style={styles.subtitle}>
        Completed experiences will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F8F6F1",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 17,
    color: "#666666",
  },
});