import { CustomFallback, errorHandler } from "@/components/ErrorBoundary";
import { persistor, store } from "@/store/store";
import { theme } from "@/theme/Theme";
import { Button, ThemeProvider } from "@rneui/themed";
import { router, Stack } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary FallbackComponent={CustomFallback} onError={errorHandler}>
            <PaperProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="screens/SettingsScreen"
                  options={{
                    headerShown: true,
                    headerLeft: () => <Button icon={{ name: "arrow-back", type: "material" }} type="clear" onPress={() => router.back()} />,
                    title: "Settings",
                  }}
                />
              </Stack>
            </PaperProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
