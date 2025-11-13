import { switchMode, updateUserId, updateEmail, updateCaseNumber, updateLanguage, updateCustomField } from "../../redux/actions";
import { clearImage, clearCase } from "../../redux/actions";
import { saveIconPath, updateIcon, updateIconUrl, updateTypeUrl, updateTypeAvailable } from "../../redux/actions";
import { deleteCameraCache } from "../../utils/cacheManager";
import { deleteAll, deleteIcons, deleteZipIcons, downloadZipFile, openZipAndExtractIcons, openZipAndExtractTypes } from "../../utils/fileHandler";
import { Linking } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { SCAN_DOC } from "../../theme/constants";
import { saveConfigType, saveCustomConfigUrl, updateFormConfig } from '../../redux/actions';

// Import des configurations de manière sécurisée
const getPresetConfig = (configType) => {
  try {
    switch (configType) {
      case "dividoc":
        return require('../../configs/Dividoc.json');
      case "divimap":
        return require('../../configs/Divimap.json');
      case "divilite":
        return require('../../configs/Divilite.json');
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error loading config ${configType}:`, error);
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

export const handleLoadConfig = async (dispatch, configType, customUrl, setAlertStates, setLoading) => {
  try {
    setLoading(true);
    let configData;

    if (configType === "custom" && customUrl) {
      // Charger depuis une URL personnalisée
      const response = await fetch(customUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      configData = await response.json();
      
      // Valider la structure du JSON
      if (!configData.fields || !Array.isArray(configData.fields)) {
        throw new Error("Invalid config structure: missing 'fields' array");
      }
      
      // Sauvegarder l'URL personnalisée
      dispatch(saveCustomConfigUrl(customUrl));
      
    } else {
      // Charger une configuration prédéfinie avec la nouvelle méthode
      configData = getPresetConfig(configType);
      
      if (!configData) {
        throw new Error(`Unknown or invalid config type: ${configType}`);
      }
      
      // Valider la structure
      if (!configData.fields || !Array.isArray(configData.fields)) {
        throw new Error("Invalid config structure: missing 'fields' array");
      }
    }

    // Mettre à jour Redux avec la nouvelle configuration
    dispatch(updateFormConfig(configData));
    dispatch(saveConfigType(configType));
    
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

export const handleConfigChange = async (configType, customConfigUrl, dispatch, setAlertStates, setLoading) => {
  setLoading(true);
  
  try {
    let config;
    
    if (configType === "custom" && customConfigUrl) {
      // Télécharger la config depuis l'URL
      const response = await fetch(customConfigUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      config = await response.json();
    } else {
      // Charger la config preset
      config = getPresetConfig(configType);
      if (!config) {
        throw new Error(`Configuration "${configType}" introuvable`);
      }
    }
    
    // Valider la structure
    if (!config.fields || !Array.isArray(config.fields)) {
      throw new Error("Format de configuration invalide");
    }
    
    // Sauvegarder dans Redux
    dispatch(saveConfigType(configType));
    if (configType === "custom") {
      dispatch(saveCustomConfigUrl(customConfigUrl));
    }
    dispatch(updateFormConfig(config));
    
    setLoading(false);
    
    // Afficher l'alerte de succès UNIQUEMENT si on vient de changer la config
    setAlertStates((prev) => ({ 
      ...prev, 
      configLoadSuccess: true,
      configLoadError: false,
      configErrorMessage: null 
    }));
    
  } catch (error) {
    console.error("Erreur lors du chargement de la config:", error);
    setLoading(false);
    setAlertStates((prev) => ({ 
      ...prev, 
      configLoadError: true,
      configErrorMessage: error.message,
      configLoadSuccess: false 
    }));
  }
};

export const handleResetConfig = (dispatch) => {
  try {
    const dividocConfig = getPresetConfig("dividoc");
    if (dividocConfig) {
      dispatch(updateFormConfig(dividocConfig));
      dispatch(saveConfigType("dividoc"));
      dispatch(saveCustomConfigUrl(""));
    } else {
      console.error("Failed to load default Dividoc config");
    }
  } catch (error) {
    console.error("Error resetting config:", error);
  }
};