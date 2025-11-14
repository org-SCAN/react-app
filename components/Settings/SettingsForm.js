import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { handleSaveUserId, handleSaveEmail, handleUpdateCaseNumber, handleUrlSave, handleUrlReset, handleCustomFieldChange, handleTypeSave, handleTypeReset, handleLoadConfig } from "../../components/Settings/SettingsHandler";
import { useSelector } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";
import SettingsFormField from "../../components/Settings/SettingsFormField";
import SettingsFormTwoButtonField from "./SettingsFormTwoButtonField";
import SettingsFormFreeField from "./SettingsFormFreeField";
import SimplePicker from "../Case/SimplePicker";

const SettingsForm = (props) => {
  const { intlData, setAlertStates, setLoading, dispatch, theme } = props;
  const styles = theme.mode == "dark" ? stylesDark : stylesLight;

  const storedUserId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const storedEmail = useSelector(state => state.email.email);
  const storedIconUrl = useSelector((state) => state.iconUrl.url);
  const storedCustomField = useSelector((state) => state.customField.customField);
  const storedTypeUrl = useSelector((state) => state.typeAvailable.url);
  const storedConfigType = useSelector((state) => state.config?.configType || "dividoc");
  const storedConfigUrl = useSelector((state) => state.config?.customConfigUrl || "");

  const [userId, setUserId] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState(0);
  const [email, setEmail] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [typeUrl, setTypeUrl] = useState('');
  const [customField, setCustomField] = useState(storedCustomField);
  const [configType, setConfigType] = useState(storedConfigType);
  const [customConfigUrl, setCustomConfigUrl] = useState('');
  const [isConfigPickerOpen, setIsConfigPickerOpen] = useState(false);

  // Options de configuration prédéfinies
  const configOptions = [
    { label: "Dividoc", value: "dividoc" },
    { label: "Divimap", value: "divimap" },
    { label: "Divilite", value: "divilite" },
    { label: intlData.messages.Settings?.customConfig || "Personnalisé", value: "custom" }
  ];

  const handleConfigTypeChange = (value) => {
    setConfigType(value);
    // Si on sélectionne une config prédéfinie et qu'elle est différente de celle stockée, on la charge
    if (value !== "custom" && value !== storedConfigType) {
      handleLoadConfig(dispatch, value, null, setAlertStates, setLoading);
    }
  };

  const handleCustomConfigSave = () => {
    if (configType === "custom" && customConfigUrl.trim() !== "") {
      handleLoadConfig(dispatch, "custom", customConfigUrl, setAlertStates, setLoading);
      setCustomConfigUrl('');
    }
  };

  return (
    <View>
      {/* Configuration Form Selector */}
      <View style={styles.fieldContainer}>
        <Text style={styles.title}>
          {intlData.messages.Settings?.configFormTitle || "Configuration du formulaire"}
        </Text>
        <SimplePicker
          items={configOptions}
          value={configType}
          setValue={handleConfigTypeChange}
          placeholder={intlData.messages.Settings?.selectConfig || "Sélectionner une configuration"}
          emptyText={intlData.messages.Common?.none || "Aucune option disponible"}
          isOpen={isConfigPickerOpen}
          setOpen={setIsConfigPickerOpen}
          clearOnSelectSame={false}
        />
        
        {/* Afficher l'URL actuelle si une config est chargée */}
        {storedConfigType && (
          <View style={styles.details}>
            <Text style={styles.detailsText}>
              {storedConfigType === "custom" 
                ? `${intlData.messages.Settings?.currentConfig || "Configuration actuelle"}: ${storedConfigUrl}`
                : `${intlData.messages.Settings?.currentConfig || "Configuration actuelle"}: ${storedConfigType.toUpperCase()}`
              }
            </Text>
          </View>
        )}
      </View>

      {/* Champ URL personnalisée (visible uniquement si "custom" est sélectionné) */}
      {configType === "custom" && (
        <SettingsFormField
          placeholder={intlData.messages.Settings?.enterConfigUrl || "URL du fichier JSON de configuration"}
          value={customConfigUrl}
          onChangeText={setCustomConfigUrl}
          onPress={handleCustomConfigSave}
          buttonText={intlData.messages.Settings?.loadConfig || "Charger la configuration"}
          storedValue={storedConfigType === "custom" ? "" : null}
          storedText=""
          noStoredText={intlData.messages.Settings?.noSavedConfigUrl || "Aucune configuration personnalisée"}
          styles={styles}
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
      <SettingsFormTwoButtonField
        placeholder={intlData.messages.Settings.enterTypeUrl}
        value={typeUrl}
        onChangeText={setTypeUrl}
        onPressLeft={() => handleTypeSave(dispatch, typeUrl, setTypeUrl, setAlertStates, setLoading)}
        onPressRight={() => handleTypeReset(dispatch, setTypeUrl)}
        buttonTextLeft={intlData.messages.Settings.saveIconUrl}
        buttonTextRight={intlData.messages.Settings.resetIconUrl}
        storedValue={storedTypeUrl}
        storedText={intlData.messages.Settings.savedTypeUrl}
        noStoredText={intlData.messages.Settings.noSavedTypeUrl}
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