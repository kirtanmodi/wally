import { useTheme } from "@rneui/themed";
import { Button, Text, useWindowDimensions, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";

export default function Index() {
  const { height, width } = useWindowDimensions();
  const { theme } = useTheme();
  const { isDarkMode } = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDarkMode ? theme.colors.background : theme.colors.primary,
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button title="Click me" color={isDarkMode ? theme.colors.primary : theme.colors.secondary} />
    </View>
  );
}
