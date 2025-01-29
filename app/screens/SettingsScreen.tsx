import { View, StyleSheet, Button, TouchableOpacity, Modal } from "react-native";
import { router } from "expo-router";
import * as React from "react";
import { Overlay, Text } from "react-native-elements";
import { Chip } from "react-native-paper";
// import Modal from "modal-react-native-web";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button title="Go Back" onPress={() => router.back()} />
      <OverlayComponent />
      <ChipComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 20,
  },
});

const OverlayComponent = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  return (
    <Overlay backdropStyle={{}} isVisible={isVisible} ModalComponent={Modal} onBackdropPress={() => setIsVisible(!isVisible)} overlayStyle={{}}>
      <Text>Some content</Text>
      <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
        <Text>Click to close</Text>
      </TouchableOpacity>
    </Overlay>
  );
};

const ChipComponent = () => (
  <Chip icon="information" onPress={() => console.log("Pressed")}>
    Example Chip
  </Chip>
);
