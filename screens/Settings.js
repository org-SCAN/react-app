import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { useDispatch } from "react-redux";
import { clearImage } from "../redux/actions";
import DarkModeToggle from "../components/Settings/DarkModeToggle";

const Settings = () => {
  const dispatch = useDispatch();
  const clear = () => {
    dispatch(clearImage());
  };
  return (
    <View style={styles.mainContent}>
      <DarkModeToggle style={styles.toggle} />
      <Button title="Clear Image" onPress={clear} />
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
