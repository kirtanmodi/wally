import { useTheme } from "@rneui/themed";
import { Button, Text, useWindowDimensions, View } from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import MyComponent from "@/components/MyComponent";

export default function Index() {
  const { height, width } = useWindowDimensions();
  const { theme } = useTheme();
  const { isDarkMode } = useColorScheme();

  return (
    <View>
      <Text>
        Window Dimensions: {width}x{height}
      </Text>
      <Text>Theme: {theme.mode}</Text>
      <Text>Color Scheme: {isDarkMode ? "dark" : "light"}</Text>
      <Button title="Test Error" onPress={() => console.log("Test Error")} />
      <MyComponent />
    </View>
  );
}
