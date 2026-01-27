import { switchMode, updateUserId, updateEmail, updateCaseNumber, updateLanguage, updateCustomField } from "../../redux/actions";
import { clearImage, clearCase } from "../../redux/actions";
import { saveIconPath, updateIcon, updateIconUrl, updateTypeUrl, updateTypeAvailable } from "../../redux/actions";
import { deleteCameraCache } from "../../utils/cacheManager";
import { deleteAll, deleteIcons, deleteZipIcons, downloadZipFile, openZipAndExtractIcons, openZipAndExtractTypes } from "../../utils/fileHandler";
import { Linking } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { SCAN_DOC } from "../../theme/constants";
import { saveConfigType, saveCustomConfigUrl, updateFormConfig } from '../../redux/actions';

// Configuration par défaut (celle qui est chargée au démarrage)
const getDefaultConfig = () => {
  try {
    return require('../../configs/DefaultConfig.json');
  } catch (error) {
    console.error('Error loading default config:', error);
    return null;
  }
};

export const handleSaveUserId = (dispatch, userId, setUserId, setAlertStates) => {
  dispatch(updateUserId(userId));
  setUserId("");
  setAlertStates((prev) => ({ ...prev, userIdUpdate: true }));
};

export const handleCustomFieldChange = (dispatch, customField, setCustomField) => {
  dispatch(updateCustomField(customField));
  setCustomField(customField);
};

export const handleSaveEmail = (dispatch, email, setAlertStates) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (!emailRegex.test(email)) {
    setAlertStates((prev) => ({ ...prev, emailError: true }));
    return;
  }
  dispatch(updateEmail(email));
  setAlertStates((prev) => ({ ...prev, emailCorrect: true }));
};

export const handleLanguageChange = (dispatch, itemValue, setSelectedValue) => {
  dispatch(updateLanguage(itemValue));
  setSelectedValue(itemValue);
};

export const handleUpdateCaseNumber = (dispatch, newCaseNumber, setNewCaseNumber, setAlertStates) => {
  dispatch(updateCaseNumber(newCaseNumber));
  setNewCaseNumber(0);
  setAlertStates((prev) => ({ ...prev, caseNumberUpdate: true }));
};

export const openDocumentation = () => {
  Linking.openURL(SCAN_DOC).catch((err) =>
    console.error('Failed to open URL:', err)
  );
};

export const handleThemeChange = (dispatch, isEnabled, setIsEnabled) => {
  setIsEnabled(!isEnabled);
  dispatch(switchMode(isEnabled ? "light" : "dark"));
};

export const handleClear = (dispatch) => {
  deleteAll();
  dispatch(clearImage());
  dispatch(clearCase());
  deleteCameraCache();
};

export const handleUrlReset = (dispatch, setIconUrl) => {
  dispatch(updateIcon(false));
  deleteIcons();
  deleteZipIcons();
  setIconUrl("");
  dispatch(updateIconUrl(null));
};

export const handleUrlSave = async (dispatch, iconUrl, setIconUrl, setAlertStates, setLoading ) => {
  setLoading(true);
  if (iconUrl) {
    try {
      console.log(iconUrl);
      await downloadZipFile(iconUrl, "/icons.zip");

      const zipPath = FileSystem.documentDirectory + "zip/icons.zip";
      const [iconPath, extractedIcons, missingIcons] = await openZipAndExtractIcons(zipPath);  
      
      if (missingIcons.length > 0) {
        setAlertStates((prev) => ({ ...prev, iconsMissing: true }));
      }
      else {
        dispatch(saveIconPath(iconPath));
        setAlertStates((prev) => ({ ...prev, iconsDownloadCorrect: true }));
        dispatch(updateIconUrl(iconUrl));
        setIconUrl("");
        dispatch(updateIcon(true));
      } 
      deleteZipIcons();
    } catch (error) {
      console.error(error);
      setAlertStates((prev) => ({ ...prev, iconsDownloadError: true }));
    }
  }
  setLoading(false);
};

export const handleTypeSave = async (dispatch, typeUrl, setTypeUrl, setAlertStates, setLoading ) => {
  setLoading(true);
  if (typeUrl) {
    try {
      console.log(typeUrl);
      await downloadZipFile(typeUrl, "/types.zip");

      const zipPath = FileSystem.documentDirectory + "zip/types.zip";
      const formattedTypes = await openZipAndExtractTypes(zipPath);  
      console.log(formattedTypes);
      if (formattedTypes.length === 0) {
        setAlertStates((prev) => ({ ...prev, typesMissing: true }));
      }
      else {
        setAlertStates((prev) => ({ ...prev, typesDownloadCorrect: true }));
        dispatch(updateTypeUrl(typeUrl));
        setTypeUrl("");
        dispatch(updateTypeAvailable(formattedTypes));
      } 
      deleteZipIcons();
    } catch (error) {
      console.error(error);
      setAlertStates((prev) => ({ ...prev, typesDownloadError: true }));
    }
  }
  setLoading(false);
};

export const handleTypeReset = (dispatch, setTypeUrl) => {
  dispatch(updateTypeUrl(""));
  setTypeUrl("");
  dispatch(updateTypeAvailable([]));
};

export const handleLoadConfig = async (dispatch, customUrl, setAlertStates, setLoading) => {
  try {
    setLoading(true);
    
    if (!customUrl || customUrl.trim() === "") {
      throw new Error("L'URL de configuration ne peut pas être vide");
    }

    // Charger depuis une URL personnalisée
    const response = await fetch(customUrl);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const configData = await response.json();
    
    // Valider la structure du JSON
    if (!configData.fields || !Array.isArray(configData.fields)) {
      throw new Error("Structure de configuration invalide: tableau 'fields' manquant");
    }
    
    // Sauvegarder l'URL personnalisée et la config
    dispatch(saveCustomConfigUrl(customUrl));
    dispatch(updateFormConfig(configData));
    dispatch(saveConfigType("custom"));
    
    setLoading(false);
    setAlertStates((prev) => ({ ...prev, configLoadSuccess: true }));
    
  } catch (error) {
    console.error("Error loading config:", error);
    setLoading(false);
    setAlertStates((prev) => ({ 
      ...prev, 
      configLoadError: true,
      configErrorMessage: error.message 
    }));
  }
};


export const handleResetConfig = (dispatch, setAlertStates) => {
  try {
    const defaultConfig = getDefaultConfig();
    if (defaultConfig) {
      dispatch(updateFormConfig(defaultConfig));
      dispatch(saveConfigType("default"));
      dispatch(saveCustomConfigUrl(""));
      setAlertStates((prev) => ({ ...prev, configLoadSuccess: true }));
    } else {
      console.error("Failed to load default config");
      setAlertStates((prev) => ({ 
        ...prev, 
        configLoadError: true,
        configErrorMessage: "Impossible de charger la configuration par défaut"
      }));
    }
  } catch (error) {
    console.error("Error resetting config:", error);
    setAlertStates((prev) => ({ 
      ...prev, 
      configLoadError: true,
      configErrorMessage: error.message
    }));
  }
};