import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
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

export function InputField({ label, value, onChangeText, placeholder, keyboardType = "numeric", suffix }: InputFieldProps) {
  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={Colors[colorScheme ?? "light"].icon}
        />
        {suffix && <ThemedText style={styles.suffix}>{suffix}</ThemedText>}
      </View>
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
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  suffix: {
    marginLeft: 8,
    fontSize: 16,
    opacity: 0.7,
  },
});
