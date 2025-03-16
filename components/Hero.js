import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Hero = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stunning Designs, Seamlessly Crafted</Text>
      <Text style={styles.subtitle}>
        We create high-quality, visually stunning designs that elevate your brand.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#bbbbbb",
    textAlign: "center",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Hero;
