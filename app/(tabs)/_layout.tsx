import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    BrownSugar: require("../../assets/fonts/BrownSugar.ttf"),
    GlassAntica: require("../../assets/fonts/GlassAntiqua-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Garde l’écran de démarrage jusqu’à ce que les polices soient prêtes
  }

  return (
    <Stack screenOptions={{ headerShown: false }} onLayout={onLayoutRootView}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}