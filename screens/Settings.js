import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import { useDispatch } from "react-redux";
import { clearImage, clearCase } from "../redux/actions";
import SettingsToggle from "../components/Settings/SettingsToggle";
import { SCAN_COLOR } from "../theme/constants";
import { showConfirmDialog } from "../components/Settings/ConfirmDialog";
import { switchMode, updateLanguage } from "../redux/actions";
import { connect } from "react-redux";
import { deleteCameraCache } from "../utils/cacheManager";
import { deleteAll } from "../utils/fileHandler";
import languagePicker from "../components/Settings/languagePicker";
import LanguagePicker from "../components/Settings/languagePicker";

const Settings = (props) => {
  const { intlData } = props;
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(true);

  // Handle changing the theme mode
  const handleThemeChange = () => {
    dispatch(switchMode(props.theme.mode === "light" ? "dark" : "light"));
  };

  const clear = () => {
    setShowBox(false);
    deleteAll();
    dispatch(clearImage());
    dispatch(clearCase());
    deleteCameraCache();
  };

  const languageFrench = () => {
    setShowBox(false);
    dispatch(updateLanguage("fr"));
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
      <View>
        <LanguagePicker></LanguagePicker>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.hint}>Debug</Text>
        <Button
          title="Clear all datas"
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
  bottomLanguage: {
    position: "absolute",
    bottom: 200,
    width: "100%",
  },
  hint: {
    fontStyle: "italic",
    color: "#B3B3B3",
    alignContent: "center",
    textAlign: "center",
  },
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
    images: state.image.image,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Settings);
