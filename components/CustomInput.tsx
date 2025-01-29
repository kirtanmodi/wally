import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { useColorScheme } from "@/hooks/useColorScheme";

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "numeric";
  icon: keyof typeof MaterialIcons.glyphMap;
}

export const CustomInput = ({ label, value, onChangeText, keyboardType = "default", icon }: CustomInputProps) => {
  const styles = useGlobalStyles();
  const { isDarkMode } = useColorScheme();

  return (
    <View style={localStyles.inputWrapper}>
      <Text style={[styles.smallText, localStyles.label]}>{label}</Text>
      <View style={[styles.row, localStyles.inputContainer]}>
        <MaterialIcons name={icon} size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
        <TextInput
          style={[styles.input, localStyles.input]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
        />
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    flex: 1,
  },
});
