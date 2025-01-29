import { TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

export const ThemeToggle = () => {
  const { updateTheme } = useTheme();
  const { isDarkMode } = useColorScheme();

  const toggleTheme = () => {
    updateTheme((theme) => ({
      mode: theme.mode === "light" ? "dark" : "light",
    }));
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleTheme}>
      <MaterialIcons name={isDarkMode ? "light-mode" : "dark-mode"} size={24} color={isDarkMode ? "#FCD34D" : "#4B5563"} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
});
