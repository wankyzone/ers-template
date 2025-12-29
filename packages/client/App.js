import React from "react";
import { View, Text } from "react-native";

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "lime", fontSize: 24 }}>
        ERS Client – It Works
      </Text>
    </View>
  );
}
