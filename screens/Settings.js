import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import { useDispatch } from "react-redux";
import { clearImage } from "../redux/actions";
import DarkModeToggle from "../components/Settings/DarkModeToggle";
import { SCAN_COLOR } from "../theme/constants";
import { showConfirmDialog } from "../components/Settings/ConfirmDialog";

const Settings = () => {
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(true);

  const clear = () => {
    setShowBox(false);
    dispatch(clearImage());
  };
  return (
    <View style={styles.mainContent}>
      {showBox}
      <DarkModeToggle style={styles.toggle} />
      <View style={styles.bottom}>
        <Button
          title="Clear Image"
          color={SCAN_COLOR}
          onPress={() =>
            showConfirmDialog(
              "Are your sure?",
              "You really want to clean all of this ?",
              clear
            )
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    margin: 30,
    height: "100%",
  },
  toggle: {
    marginBottom: 20,
  },
  bottom: {
    position: "absolute",
    bottom: 50,
    width: "100%",
  },
});

export default Settings;
