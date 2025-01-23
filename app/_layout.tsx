import { CustomFallback, errorHandler } from "@/components/ErrorBoundary";
import { persistor, store } from "@/store/store";
import { theme } from "@/theme/Theme";
import { ThemeProvider } from "@rneui/themed";
import { Stack } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ErrorBoundary FallbackComponent={CustomFallback} onError={errorHandler}>
            <Stack />
          </ErrorBoundary>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
