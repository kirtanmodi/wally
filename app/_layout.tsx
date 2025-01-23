import { CustomFallback, errorHandler } from "@/components/ErrorBoundary";
import { Stack } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";

export default function RootLayout() {
  return (
    <ErrorBoundary FallbackComponent={CustomFallback} onError={errorHandler}>
      <Stack />
    </ErrorBoundary>
  );
}
