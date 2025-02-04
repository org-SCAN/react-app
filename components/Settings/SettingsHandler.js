import { switchMode, updateUserId, updateEmail, updateCaseNumber, updateLanguage, updateCustomField } from "../../redux/actions";
import { clearImage, clearCase } from "../../redux/actions";
import { saveIconPath, updateIcon, updateIconUrl } from "../../redux/actions";
import { deleteCameraCache } from "../../utils/cacheManager";
import { deleteAll, deleteIcons, deleteZipIcons, downloadZipFile, openZipAndExtractIcons } from "../../utils/fileHandler";
import { Linking } from "react-native";
import * as FileSystem from "expo-file-system";
import { SCAN_DOC } from "../../theme/constants";

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
  setLoading(true)
  if (iconUrl) {
    try {
      console.log(iconUrl);
      await downloadZipFile(iconUrl);

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
  setLoading(false)
};