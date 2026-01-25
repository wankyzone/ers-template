import { Text, View } from "react-native";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
      }}
    >
      <Text style={{ color: "#22c55e", fontSize: 22, fontWeight: "600" }}>
        ERS Mobile is live 🚀
      </Text>
    </View>
  );
}
