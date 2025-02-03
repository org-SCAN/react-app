import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { handleSaveUserId, handleSaveEmail, handleUpdateCaseNumber, handleUrlSave, handleUrlReset } from "../../components/Settings/SettingsHandler";

import { useSelector, useDispatch } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";
import SettingsFormField from "../../components/Settings/SettingsFormField";
import SettingsFormTwoButtonField from "../../components/Settings/SettingsFormTwoButtonField";


const SettingsForm = (props) => {
  const { intlData, setAlertStates, setLoading, dispatch, theme } = props;
  const styles = theme.mode == "dark" ? stylesDark : stylesLight;

  const [userId, setUserId] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState(0);
  const [email, setEmail] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  const storedUserId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const storedEmail = useSelector(state => state.email.email);
  const storedIconUrl = useSelector((state) => state.iconUrl.url);

  return (
    <View>
      <SettingsFormField
        placeholder={intlData.messages.Settings.enterUserID}
        value={userId}
        maxLength={10}
        onChangeText={setUserId}
        onPress={() => handleSaveUserId(dispatch, userId, setUserId, setAlertStates)}
        buttonText={intlData.messages.Settings.saveUserID}
        storedValue={storedUserId}
        storedText={intlData.messages.Settings.savedUserID}
        noStoredText={intlData.messages.Settings.noSavedUserID}
        styles={styles}
      />
      <SettingsFormField
        placeholder={intlData.messages.Settings.newCaseNumber}
        value={newCaseNumber ? newCaseNumber.toString() : ""}
        keyboardType="numeric"
        onChangeText={(text) => setNewCaseNumber(parseInt(text))}
        onPress={() => handleUpdateCaseNumber(dispatch, newCaseNumber, setNewCaseNumber, setAlertStates)}
        buttonText={intlData.messages.Settings.resetCaseNumber}
        storedValue={caseNumber}
        storedText={intlData.messages.Settings.storedCaseNumber}
        noStoredText={intlData.messages.Settings.storedCaseNumber + " : 0"}
        styles={styles}
      />
      <SettingsFormField
        placeholder={intlData.messages.Settings.enterEmail}
        value={email}
        onChangeText={setEmail}
        onPress={() => handleSaveEmail(dispatch, email, setAlertStates)}
        buttonText={intlData.messages.Settings.saveEmail}
        storedValue={storedEmail}
        storedText={intlData.messages.Settings.savedEmail}
        noStoredText={intlData.messages.Settings.noSavedEmail}
        styles={styles}
      />   
      <SettingsFormTwoButtonField
        placeholder={intlData.messages.Settings.enterIconUrl}
        value={iconUrl}
        onChangeText={setIconUrl}
        onPressLeft={() => handleUrlSave(dispatch, iconUrl, setIconUrl, setAlertStates, setLoading)}
        onPressRight={() => handleUrlReset(dispatch, setIconUrl)}
        buttonTextLeft={intlData.messages.Settings.saveIconUrl}
        buttonTextRight={intlData.messages.Settings.resetIconUrl}
        storedValue={storedIconUrl}
        storedText={intlData.messages.Settings.savedIconUrl}
        noStoredText={intlData.messages.Settings.noSavedIconUrl}
        styles={styles}
      />
    </View>
  );
};

const baseStyles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    paddingLeft: 8,
  },
  button: {
    marginVertical: 5,
    height: 40,
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
  },
  twoButtonsContainer: { 
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  twoButtonsRight: {
    flex: 1,
    marginVertical: 5,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    marginLeft: 5,
  },
  twoButtonsLeft: {
    flex: 1,
    marginVertical: 5,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    marginRight: 5,
  },
  buttonTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16,
  },
  details: {
    marginBottom: 5,
    color: "gray",
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  placeholder: {
    color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER,
  },
  details: {
    ...baseStyles.details,
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
  },
  button: {
    ...baseStyles.button,
    backgroundColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BORDER,
  },
  twoButtonsLeft: {
    ...baseStyles.twoButtonsLeft,
    backgroundColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BORDER,
  },
  twoButtonsRight: {
    ...baseStyles.twoButtonsRight,
    backgroundColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BORDER,
  },
  buttonTitle: {
    ...baseStyles.buttonTitle,
    color: THEME_COLOR.LIGHT.SETTINGS_BUTTON_TEXT,
  }
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  placeholder: {
    color: THEME_COLOR.DARK.INPUT_PLACE_HOLDER,
  },
  details: {
    ...baseStyles.details,
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
  },
  button: {
    ...baseStyles.button,
    backgroundColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BORDER,
  },
  twoButtonsLeft: {
    ...baseStyles.twoButtonsLeft,
    backgroundColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BORDER,
  },
  twoButtonsRight: {
    ...baseStyles.twoButtonsRight,
    backgroundColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BORDER,
  },
  buttonTitle: {
    ...baseStyles.buttonTitle,
    color: THEME_COLOR.DARK.SETTINGS_BUTTON_TEXT,
  }
});

export default SettingsForm;
