import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Hero />
      <Features />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
});

export default HomeScreen;
