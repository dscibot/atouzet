import { View, Text, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>© 2025 YourBrand. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    marginTop: 30,
  },
  text: {
    fontSize: 14,
    color: "#bbbbbb",
  },
});
