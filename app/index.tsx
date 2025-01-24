import { Button, Text, useWindowDimensions, View, StyleSheet } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import MyComponent from "@/components/MyComponent";
import { Card, useTheme } from "@rneui/themed";
import { AppTheme } from "@/theme/Theme";

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
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>Card Title</Card.Title>
          <Card.Divider />
          <Card.Image source={{ uri: "https://picsum.photos/200/300" }} style={styles.cardImage} />
        </Card>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme, isDarkMode: boolean, width: number, height: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
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
