import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, TextInput, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { clearImage, clearCase } from "../redux/actions";
import SettingsToggle from "../components/Settings/SettingsToggle";
import { SCAN_COLOR } from "../theme/constants";
import { showConfirmDialog } from "../components/Settings/ConfirmDialog";
import { switchMode, updateLanguage } from "../redux/actions";
import { connect } from "react-redux";
import { deleteCameraCache } from "../utils/cacheManager";
import { deleteAll } from "../utils/fileHandler";
import LanguagePicker from "../components/Settings/languagePicker";

const Settings = (props) => {
  const { intlData } = props;
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(true);
  const [userId, setUserId] = useState('');
  const [storedUserId, setStoredUserId] = useState('');

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

  const handleSaveUserId = () => {
    if (/^\d{5}$/.test(userId)) {
      setStoredUserId(userId);
      Alert.alert("Success", "User ID has been saved!");
    } else {
      Alert.alert("Error", "Please enter a valid 5-digit User ID.");
    }
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
        title={intlData.messages.Settings.lightTheme}
        description={intlData.messages.Settings.themeDescription}
      />
      <View>
        <LanguagePicker />
      </View>
      <View style={styles.bottom}>
        <Text style={styles.hint}>Debug</Text>
        <Button
          title={intlData.messages.Settings.debugMessage}
          color={SCAN_COLOR}
          onPress={() =>
            showConfirmDialog(
              intlData.messages.Settings.clearCases1,
              intlData.messages.Settings.clearCases2,
              clear
            )
          }
        />
      </View>
      <View style={styles.userIdContainer}>
        <Text style={styles.label}>Enter User ID:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={5}
          value={userId}
          onChangeText={setUserId}
        />
        <Button
          title="Save User ID"
          onPress={handleSaveUserId}
          color={SCAN_COLOR}
        />
        {storedUserId ? <Text>Stored User ID: {storedUserId}</Text> : null}
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
  userIdContainer: {
    marginTop: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
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