import { StyleProp, StyleSheet, TextInput, View, ViewStyle, Platform } from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "numeric" | "default";
  suffix?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export function InputField({ label, value, onChangeText, placeholder, keyboardType = "numeric", suffix, error }: InputFieldProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={[styles.inputContainer, isDark && styles.inputContainerDark, error && styles.inputError]}>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme ?? "light"].text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={Colors[colorScheme ?? "light"].icon}
        />
        {suffix && <ThemedText style={styles.suffix}>{suffix}</ThemedText>}
      </View>
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainerDark: {
    borderColor: "#2D3748",
    backgroundColor: "#1A202C",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingVertical: 12,
  },
  suffix: {
    marginLeft: 8,
    fontSize: 16,
    opacity: 0.7,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
});
