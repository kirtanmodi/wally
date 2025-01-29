import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function TabLayout() {
  const { theme } = useTheme();
  const { isDarkMode } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: isDarkMode ? "#6B7280" : "#9CA3AF",
        tabBarStyle: {
          backgroundColor: isDarkMode ? theme.colors.background : "#FFFFFF",
          borderTopColor: isDarkMode ? "#374151" : "#E5E7EB",
        },
        headerStyle: {
          backgroundColor: isDarkMode ? theme.colors.background : "#FFFFFF",
        },
        headerTintColor: theme.colors.primary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="todos"
        options={{
          title: "Todos",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="breakdown"
        options={{
          title: "Breakdown",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="analytics" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
