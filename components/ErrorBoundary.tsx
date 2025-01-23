import { View, Text, Button, StyleSheet, Dimensions, Platform } from "react-native";
import ErrorBoundary from "react-native-error-boundary";
import { useMemo } from "react";

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const CustomFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const errorMessage = useMemo(() => {
    try {
      return error.toString().slice(0, 150) + (error.toString().length > 150 ? "..." : "");
    } catch {
      return "An unexpected error occurred";
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        <Text style={styles.title}>Oops! Something went wrong</Text>

        <View style={styles.divider} />

        <Text style={styles.errorMessage}>{errorMessage}</Text>

        <Button
          onPress={() => {
            try {
              resetError();
            } catch (e) {
              console.error("Failed to reset error:", e);
            }
          }}
          title="Try Again"
          color={Platform.select({ ios: "#007AFF", android: "#2196F3" })}
        />
      </View>
    </View>
  );
};

export const errorHandler = (error: Error, stackTrace: string): void => {
  // Log error to your preferred logging service
  console.error("Error Boundary caught an error:", {
    error: error.toString(),
    stack: stackTrace,
    timestamp: new Date().toISOString(),
  });
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E9ECEF",
    width: "100%",
    marginVertical: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6C757D",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
});
