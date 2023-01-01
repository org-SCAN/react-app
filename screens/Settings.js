import React, { useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import { useDispatch } from "react-redux";
import { clearImage } from "../redux/actions";
import SettingsToggle from "../components/Settings/SettingsToggle";
import { SCAN_COLOR } from "../theme/constants";
import { showConfirmDialog } from "../components/Settings/ConfirmDialog";
import { switchMode } from "../redux/actions";
import { connect } from "react-redux";

const Settings = (props) => {
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(true);

  // Handle changing the theme mode
  const handleThemeChange = () => {
    dispatch(switchMode(props.theme.mode === "light" ? "dark" : "light"));
  };

  const clear = () => {
    setShowBox(false);
    dispatch(clearImage());
  };
  return (
    <View style={styles.mainContent}>
      {showBox}
      <SettingsToggle
        style={styles.toggle}
        onChange={() => {
          handleThemeChange();
        }}
        value={props.theme.mode === "dark"}
        title="Dark Mode"
        description="Change the theme of the app"
      />
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

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(Settings);
