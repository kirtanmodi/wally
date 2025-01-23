import { View, Button } from "react-native";

export default function TestError() {
  const throwError = () => {
    throw new Error("This is a test error!");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Throw Error" onPress={throwError} />
    </View>
  );
}
