import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const styles = useGlobalStyles();

  return (
    <View style={[styles.container, styles.padding]}>
      <Text style={styles.headerText}>Welcome</Text>
      <View style={styles.card}>
        <Text style={styles.bodyText}>Content goes here</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Click Me</Text>
      </TouchableOpacity>
    </View>
  );
}
