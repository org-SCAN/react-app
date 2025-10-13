import { switchMode, updateEmail, updateCaseNumber, updateLanguage, updateCustomField } from "../../redux/actions";
import { clearImage, clearCase } from "../../redux/actions";
import { deleteCameraCache } from "../../utils/cacheManager";
import { deleteAll, deleteIcons, deleteZipIcons, downloadZipFile, openZipAndExtractIcons, openZipAndExtractTypes } from "../../utils/fileHandler";
import { Linking } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { SCAN_DOC } from "../../theme/constants";

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

export const handleTypeSave = async (dispatch, typeUrl, setTypeUrl, setAlertStates, setLoading ) => {
  setLoading(true)
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
  setLoading(false)
};

export const handleTypeReset = (dispatch, setTypeUrl) => {
  dispatch(updateTypeUrl(""));
  setTypeUrl("");
  dispatch(updateTypeAvailable([]));
}