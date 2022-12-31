import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Case = () => {
  return (
    <View style={styles.mainContent}>
      <Text>New Case</Text>
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
