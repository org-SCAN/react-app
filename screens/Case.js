import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import ScanInput from "../components/BasicUI/ScanInput";

const Case = () => {
  const [forename, onChangeForename] = useState("");
  const [lastname, onChangeLastname] = useState("");
  const [age, onChangeAge] = useState("");

  return (
    <View style={styles.mainContent}>
      <ScanInput
        placeholder="Forename"
        value={forename}
        onChangeText={onChangeForename}
      />
      <ScanInput
        placeholder="Lastname"
        value={lastname}
        onChangeText={onChangeLastname}
      />
      <ScanInput
        placeholder="Age"
        value={age}
        onChangeText={onChangeAge}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Case;
