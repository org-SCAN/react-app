import React from "react";
import { StyleSheet, View } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <ScanButton title="New Case" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
});

export default Home;
