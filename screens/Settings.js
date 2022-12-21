import React from "react";
import { StyleSheet, View } from "react-native";

class Settings extends React.Component {
  render() {
    return <View style={styles.mainContent}></View>;
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Settings;
