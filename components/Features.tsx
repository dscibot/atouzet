import { View, Text, StyleSheet } from "react-native";

export default function Features() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Why Choose Us?</Text>
      <Text style={styles.feature}>✅ Innovative Designs</Text>
      <Text style={styles.feature}>✅ User-Centric Approach</Text>
      <Text style={styles.feature}>✅ Seamless Experience</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  feature: {
    fontSize: 16,
    color: "#bbbbbb",
    marginVertical: 5,
  },
});
