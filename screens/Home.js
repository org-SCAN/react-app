import React from "react";
import { StyleSheet, View } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";

class Home extends React.Component {
  render() {
    return (
      <View style={styles.mainContent}>
        <View style={styles.menu}>
          <ScanButton title="New Case" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
