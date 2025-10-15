import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { handleSaveEmail, handleCustomFieldChange, handleTypeSave, handleTypeReset } from "../../components/Settings/SettingsHandler";
import { useSelector } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";
import SettingsFormField from "../../components/Settings/SettingsFormField";
import SettingsFormTwoButtonField from "./SettingsFormTwoButtonField";
import SettingsFormFreeField from "./SettingsFormFreeField";


const SettingsForm = (props) => {
  const { intlData, setAlertStates, setLoading, dispatch, theme } = props;
  const styles = theme.mode == "dark" ? stylesDark : stylesLight;

  const storedEmail = useSelector(state => state.email.email);
  const storedCustomField = useSelector((state) => state.customField.customField);
  const storedTypeUrl = useSelector((state) => state.typeAvailable.url);

  const [email, setEmail] = useState('');
  const [typeUrl, setTypeUrl] = useState('');
  const [customField, setCustomField] = useState(storedCustomField);

  return (
    <View>
      <View style={styles.compactSection}>
        <SettingsFormFreeField
          title={intlData.messages.Settings.customFieldTitle}
          placeholder={intlData.messages.Settings.customFieldPlaceholder}
          value={customField}
          onChangeText={setCustomField}
          onBlur={() => handleCustomFieldChange(dispatch, customField, setCustomField)}
          styles={styles}
        />
      </View>

      <SettingsFormField
        title={intlData.messages.Settings.emailFieldTitle}
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
    </View>
  );
};

const baseStyles = StyleSheet.create({
  compactSection: {
    marginTop: 0,
    marginBottom: 5,
  },
  fieldContainer: {
    marginVertical: 8,
  },
  title: {
    fontWeight: "600",
    marginTop: 6,
    marginBottom: 4,
    fontSize: 15,
  },
  freeFieldContainer: {
    marginVertical: 8,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    paddingLeft: 8,
  },
  freeInput: {
    width: `100%`,
    borderWidth: 1,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    paddingLeft: 8,
    paddingTop: 10, 
    paddingBottom: 8,
    minHeight: 40,
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
  title: {
    ...baseStyles.title,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  freeInput: {
    ...baseStyles.freeInput,
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
  title: {
    ...baseStyles.title,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  freeInput: {
    ...baseStyles.freeInput,
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