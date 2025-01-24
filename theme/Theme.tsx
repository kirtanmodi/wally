import { createTheme, darkColors, lightColors } from "@rneui/themed";

export interface AppTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    error: string;
    warning: string;
    success: string;
    disabled: string;
  };
}

export const theme = createTheme({
  lightColors: {
    primary: "#3B82F6", // Modern blue
    secondary: "#10B981", // Emerald green
    background: "#FFFFFF",
    error: "#EF4444", // Red
    warning: "#F59E0B", // Amber
    success: "#10B981", // Green
    disabled: "#94A3B8", // Slate gray
  },
  darkColors: {
    primary: "#60A5FA", // Lighter blue for dark mode
    secondary: "#34D399", // Lighter emerald for dark mode
    background: "#0F172A", // Dark blue background
    error: "#FCA5A5", // Lighter red
    warning: "#FCD34D", // Lighter amber
    success: "#34D399", // Lighter green
    disabled: "#64748B", // Lighter slate
  },
  components: {
    Button: {
      raised: true,
    },
  },
});
