import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { isDarkMode } = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? theme.colors.background : "#FFFFFF",
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#374151" : "#E5E7EB",
    },
    label: {
      fontSize: 16,
      color: isDarkMode ? "#E5E7EB" : "#374151",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Appearance</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Dark Mode</Text>
          <ThemeToggle />
        </View>
      </View>
    </View>
  );
}
