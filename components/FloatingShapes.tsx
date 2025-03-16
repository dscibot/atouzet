import React from "react";
import { View, StyleSheet } from "react-native";

export default function FloatingShapes() {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.blue, { top: 50, left: 20 }]} />
      <View style={[styles.circle, styles.pink, { top: 120, right: 40 }]} />
      <View style={[styles.circle, styles.yellow, { bottom: 80, left: 50 }]} />
      <View style={[styles.circle, styles.purple, { bottom: 150, right: 30 }]} />
      <View style={[styles.circle, styles.orange, { top: 200, right: 100 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  circle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.6,
  },
  blue: { backgroundColor: "#007BFF" },
  pink: { backgroundColor: "#FF6392" },
  yellow: { backgroundColor: "#FFD166" },
  purple: { backgroundColor: "#9B5DE5" },
  orange: { backgroundColor: "#FF8C42" },
});
