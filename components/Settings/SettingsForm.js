import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { handleSaveUserId, handleSaveEmail, handleUpdateCaseNumber, handleCustomFieldChange, handleLoadConfig, handleResetConfig } from "../../components/Settings/SettingsHandler";
import { useSelector } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";
import SettingsFormField from "../../components/Settings/SettingsFormField";
import SettingsFormFreeField from "./SettingsFormFreeField";
import SettingsButton from "../../components/Settings/SettingsButton";

const SettingsForm = (props) => {
  const { intlData, setAlertStates, setLoading, dispatch, theme } = props;
  const styles = theme.mode == "dark" ? stylesDark : stylesLight;

  const storedUserId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const storedEmail = useSelector(state => state.email.email);
  const storedCustomField = useSelector((state) => state.customField.customField);
  const storedConfigUrl = useSelector((state) => state.config?.customConfigUrl || "");

  const [userId, setUserId] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState(0);
  const [email, setEmail] = useState('');
  const [customField, setCustomField] = useState(storedCustomField);
  const [customConfigUrl, setCustomConfigUrl] = useState('');

  const handleCustomConfigSave = () => {
    if (customConfigUrl.trim() !== "") {
      handleLoadConfig(dispatch, customConfigUrl, setAlertStates, setLoading);
      setCustomConfigUrl('');
    }
  };

  const handleResetToDefault = () => {
    handleResetConfig(dispatch, setAlertStates);
  };

  return (
    <View>
      {/* Configuration Form URL */}
      <SettingsFormField
        title={intlData.messages.Settings?.configFormTitle || "Configuration du formulaire"}
        placeholder={intlData.messages.Settings?.enterConfigUrl || "URL du fichier JSON de configuration"}
        value={customConfigUrl}
        onChangeText={setCustomConfigUrl}
        onPress={handleCustomConfigSave}
        buttonText={intlData.messages.Settings?.loadConfig || "Charger la configuration"}
        storedValue={storedConfigUrl}
        storedText={intlData.messages.Settings?.currentConfig || "Configuration actuelle"}
        noStoredText={intlData.messages.Settings?.noSavedConfigUrl || "Aucune configuration chargée"}
        styles={styles}
      />
      
      {/* Bouton pour réinitialiser à la config par défaut */}
      {storedConfigUrl && (
        <SettingsButton
          onPress={handleResetToDefault}
          buttonText={intlData.messages.Settings?.resetToDefaultConfig || "Réinitialiser à la configuration par défaut"}
          {...props}
        />
      )}

      <SettingsFormFreeField
        title={intlData.messages.Settings.customFieldTitle}
        placeholder={intlData.messages.Settings.customFieldPlaceholder}
        value={customField}
        onChangeText={setCustomField}
        onBlur={() => handleCustomFieldChange(dispatch, customField, setCustomField)}
        styles={styles}
      />
      
      <SettingsFormField
        title={intlData.messages.Settings.adminSettings}
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
    </View>
  );
};

const baseStyles = StyleSheet.create({
  fieldContainer: {
    marginVertical: 10,
  },
  title: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
    fontSize: 15,
  },
  freeFieldContainer: {
    marginVertical: 10,
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
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12,
    fontStyle: 'italic',
  },
  detailsText: {
    fontSize: 12,
    fontStyle: 'italic',
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
  detailsText: {
    ...baseStyles.detailsText,
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
  detailsText: {
    ...baseStyles.detailsText,
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