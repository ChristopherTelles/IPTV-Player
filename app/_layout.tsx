import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider as ThemeProviderWrapper } from "@/lib/theme-provider";
import { IPTVProvider } from "@/context/IPTVContext";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({});

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProviderWrapper>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <IPTVProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="player"
                  options={{
                    headerShown: false,
                    presentation: "fullScreenModal",
                    animation: "fade",
                  }}
                />
                <Stack.Screen
                  name="search"
                  options={{
                    headerShown: false,
                    presentation: "modal",
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="light" />
            </IPTVProvider>
          </ThemeProvider>
        </ThemeProviderWrapper>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
