import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    BrownSugar: require('../../assets/fonts/BrownSugar.ttf'),
    GlassAntica: require('../../assets/fonts/GlassAntiqua-Regular.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) {
      console.log('Fonts loading...');
    } else {
      console.log('Fonts loaded successfully');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Ou un écran de chargement si vous préférez
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Masquer l'en-tête par défaut
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="privacy-policy" options={{ title: 'Politique de Confidentialité' }} />
    </Stack>
  );
}