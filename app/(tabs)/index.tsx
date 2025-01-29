import { Button, Text, useWindowDimensions, View, StyleSheet } from "react-native";
import MyComponent from "@/components/MyComponent";
import { Card, useTheme } from "@rneui/themed";
import { AppTheme } from "@/theme/Theme";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Index() {
  const { height, width } = useWindowDimensions();
  const { theme } = useTheme();
  const { isDarkMode } = useColorScheme();

  // Generate styles using the factory function
  const styles = createStyles(theme, isDarkMode, width, height);

  return (
    <View style={styles.container}>
      <Text style={styles.windowText}>
        Window Dimensions: {width}x{height}
      </Text>
      <Text style={styles.themeText}>Theme: {theme.mode}</Text>
      <Text style={styles.themeText}>Color Scheme: {isDarkMode ? "dark" : "light"}</Text>

      <View style={styles.cardContainer}>
        <Card.Image source={{ uri: "https://picsum.photos/200/300" }} style={styles.cardImage} />
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme, isDarkMode: boolean, width: number, height: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDarkMode ? theme.colors.background : "#FFFFFF",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: isDarkMode ? theme.colors.background : "#FFFFFF",
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#374151" : "#E5E7EB",
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
    },
    windowText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginBottom: 10,
    },
    themeText: {
      fontSize: 16,
      color: theme.colors.primary,
      marginBottom: 10,
    },
    cardContainer: {
      justifyContent: "center",
      width: width * 0.9, // 90% of screen width
      maxHeight: height * 0.7, // 70% of screen height
      backgroundColor: isDarkMode ? theme.colors.background : theme.colors.primary,
      borderRadius: 8,
      padding: 10,
    },
    card: {
      borderRadius: 8,
      backgroundColor: isDarkMode ? theme.colors.background : theme.colors.primary,
    },
    cardTitle: {
      color: theme.colors.primary,
      fontSize: 18,
      fontWeight: "bold",
    },
    cardImage: {
      width: "100%",
      height: 200,
      borderRadius: 8,
    },
    button: {
      marginVertical: 10,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
  });
};
