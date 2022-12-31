import React from "react";
import { StyleSheet, View } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";

const Home = ({ navigation: { navigate } }) => {
  return (
    <View style={styles.mainContent}>
      <View style={styles.menu}>
        <ScanButton
          title="New case"
          onPress={() => {
            navigate("Camera");
          }}
        />
        <ScanButton
          title="Consult cases"
          onPress={() => {
            navigate("Pictures");
          }}
        />
      </View>
    </View>
  );
};

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
