import React from "react";
import { StyleSheet, View } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";
import IconButton from "../components/BasicUI/IconButton";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.mainContent}>
        <View style={styles.settings}>
          <IconButton name="settings" />
        </View>
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
  settings: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Home;
