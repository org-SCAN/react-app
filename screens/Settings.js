import React from "react";
import { StyleSheet, View } from "react-native";
import DarkModeToggle from "../components/Settings/DarkModeToggle";

const Settings = () => {
  return (
    <View style={styles.mainContent}>
      <DarkModeToggle style={styles.toggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    margin: 30,
  },
  toggle: {
    marginBottom: 20,
  },
});

export default Settings;
