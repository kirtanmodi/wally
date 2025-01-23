import { CustomFallback, errorHandler } from "@/components/ErrorBoundary";
import { theme } from "@/theme/Theme";
import { ThemeProvider } from "@rneui/themed";
import { Stack } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary FallbackComponent={CustomFallback} onError={errorHandler}>
        <Stack />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
