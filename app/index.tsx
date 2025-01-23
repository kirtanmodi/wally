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
      <MyComponent />
    </View>
  );
}
