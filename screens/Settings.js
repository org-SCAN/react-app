import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, TextInput, Alert, TouchableWithoutFeedback, TouchableOpacity, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUserId, updateCaseNumber, updateEmail, updateIconUrl, saveIconPath, updateIcon} from "../redux/actions";
import { clearImage, clearCase } from "../redux/actions";
import SettingsToggle from "../components/Settings/SettingsToggle";
import {SCAN_DOC, THEME_COLOR } from "../theme/constants";
import CustomAlert from "../components/Case/CustomAlert";
import CustomAlertTwoButtons from "../components/Case/CustomAlertTwoButtons";
import { switchMode, updateLanguage } from "../redux/actions";
import { connect } from "react-redux";
import { deleteCameraCache } from "../utils/cacheManager";
import { deleteAll, deleteIcons, deleteZipIcons } from "../utils/fileHandler";
import LanguagePicker from "../components/Settings/languagePicker";
import { KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import {openZipAndExtractIcons, downloadZipFile } from "../utils/fileHandler";
import * as FileSystem from "expo-file-system";
//import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const Settings = (props) => {
  const { intlData } = props;
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(true);

  const [userId, setUserId] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState(0);
  const [email, setEmail] = useState('');
  const [iconUrl, setIconUrl] = useState('');

  const storedUserId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const storedEmail = useSelector(state => state.email.email);
  const storedIconUrl = useSelector((state) => state.iconUrl.url);

  const [alertVisibleUserID, setAlertVisibleUserID] = useState(false);
  const [alertVisibleEmailCorrect, setAlertVisibleEmailCorrect] = useState(false);
  const [alertVisibleEmailError, setAlertVisibleEmailError] = useState(false);
  const [alertVisibleCaseNumber, setAlertVisibleCaseNumber] = useState(false); 
  const [alertVisibleClear, setAlertVisibleClear] = useState(false);
  const [alertVisibleUrl, setAlertVisibleUrl] = useState(false);
  const [alertVisibleDownloadCorrect, setAlertVisibleDownloadCorrect] = useState(false);
  const [alertVisibleMissingIcons, setAlertVisibleMissingIcons] = useState(false);
  const [alertVisibleDownloadError, setAlertVisibleDownloadError] = useState(false);


  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;

  //handle new casenumber
  const handleUpdateCaseNumber = (newCaseNumber) => {
    dispatch(updateCaseNumber(newCaseNumber));
    setAlertVisibleCaseNumber(true);
  };

  const showClearDialog = () => {
    setAlertVisibleClear(true);
  };

  const openDocumentation = () => {
    Linking.openURL(SCAN_DOC).catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  // Handle changing the theme mode
  const handleThemeChange = () => {
    dispatch(switchMode(props.theme.mode === "light" ? "dark" : "light"));
  };

  /* Input value set to stored value (not necessary 
  if we have the details stored value)
  useEffect(() => {
    if (storedUserId) {
      setUserId(storedUserId);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [storedUserId, storedEmail]);
  */
  const clear = () => {
    setShowBox(false);
    deleteAll();
    dispatch(clearImage());
    dispatch(clearCase());
    deleteCameraCache();
  };

  const handleSaveUserId = () => {
    dispatch(updateUserId(userId));
    setUserId('');
    setAlertVisibleUserID(true);
  };

  const handleUrlReset = () => {
    dispatch(updateIcon(false));
    deleteIcons();
    deleteZipIcons();
    setIconUrl("");
    dispatch(updateIconUrl(null));
  };
  const handleUrlSave = async () => {
    if (iconUrl) {
      try {
        console.log(iconUrl);
        await downloadZipFile(iconUrl);

        const zipPath = FileSystem.documentDirectory + "zip/icons.zip";
        const [iconPath, extractedIcons, missingIcons] = await openZipAndExtractIcons(zipPath);  
        
        if (missingIcons.length > 0) {
          setAlertVisibleMissingIcons(true);
        }
        else {
          dispatch(saveIconPath(iconPath)); 
          setAlertVisibleDownloadCorrect(true);
          dispatch(updateIconUrl(iconUrl));
          setIconUrl("");
          dispatch(updateIcon(true));
        } 
        deleteZipIcons();
      } catch (error) {
        console.error(error);
        setAlertVisibleDownloadError(true);
      }
    }
  };

  const handleEmailChange = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      setAlertVisibleEmailError(true);
      return;
    }
    dispatch(updateEmail(email));
    setAlertVisibleEmailCorrect(true);
  }
  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContent}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContent} automaticallyAdjustKeyboardInsets={true}>
            <SettingsToggle
              style={styles.toggle}
              onChange={handleThemeChange}
              value={props.theme.mode === "dark"}
              title={intlData.messages.Settings.lightTheme}
              description={intlData.messages.Settings.themeDescription}
            />
            <View>
              <LanguagePicker />
            </View>

            <View style={styles.fieldContainer}> 
              <TextInput
                placeholder={intlData.messages.Settings.enterUserID}
                placeholderTextColor={styles.placeholder.color}
                style={styles.input}
                //keyboardType="alphanumeric" crash on ios
                maxLength={10}
                value={userId}
                onChangeText={setUserId}
              />
              <TouchableOpacity
                onPress={handleSaveUserId}
                style={styles.button}
              >
                <Text style={styles.buttonTitle}>{intlData.messages.Settings.saveUserID}</Text>
              </TouchableOpacity>
              {storedUserId ? <Text style={styles.details}>{intlData.messages.Settings.savedUserID} : {storedUserId}</Text> : <Text style={styles.details}>{intlData.messages.Settings.noSavedUserID}</Text>}
            </View>
            <View style={styles.fieldContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={intlData.messages.Settings.newCaseNumber}
                placeholderTextColor={styles.placeholder.color}
                onChangeText={(text) => setNewCaseNumber(parseInt(text))}
              />
              <TouchableOpacity
                onPress={() => handleUpdateCaseNumber(newCaseNumber)}
                style={styles.button}
              >
                <Text style={styles.buttonTitle}>{intlData.messages.Settings.resetCaseNumber}</Text>
              </TouchableOpacity>
              {caseNumber ? <Text style={styles.details}>{intlData.messages.Settings.storedCaseNumber} : {caseNumber}</Text> : <Text style={styles.details}>{intlData.messages.Settings.storedCaseNumber} : 0</Text>}
            </View>
            <View style={styles.fieldContainer}> 
              <TextInput
                placeholder={intlData.messages.Settings.enterEmail}
                placeholderTextColor={styles.placeholder.color}
                style={styles.input}
                //keyboardType="alphanumeric" crash on ios
                //maxLength={10}
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity
                onPress={handleEmailChange}
                style={styles.button}
              >
                <Text style={styles.buttonTitle}>{intlData.messages.Settings.saveEmail}</Text>
              </TouchableOpacity>
              {storedEmail ? <Text style={styles.details}>{intlData.messages.Settings.savedEmail} : {storedEmail}</Text> : <Text style={styles.details}>{intlData.messages.Settings.noSavedEmail}</Text>}
            </View>

            <View style={styles.fieldContainer}>
              <TextInput
                placeholder={intlData.messages.Settings.enterIconUrl}
                placeholderTextColor={styles.placeholder.color}
                style={styles.input}
                value={iconUrl}
                onChangeText={setIconUrl}
              />
              <View style={styles.twoButtonsContainer}>
                <TouchableOpacity
                  onPress={handleUrlSave}
                  style={styles.twoButtonsLeft}
                >
                  <Text style={styles.buttonTitle}>{intlData.messages.Settings.saveIconUrl}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUrlReset}
                  style={styles.twoButtonsRight}
                >
                  <Text style={styles.buttonTitle}>{intlData.messages.Settings.resetIconUrl}</Text>
                </TouchableOpacity>
              </View>
              {storedIconUrl ? <Text style={styles.details}>{intlData.messages.Settings.savedIconUrl}: {storedIconUrl}</Text>:<Text style={styles.details}>{intlData.messages.Settings.noSavedIconUrl}</Text>}
            </View>
            <TouchableOpacity
              onPress={openDocumentation}
              style={styles.button}
            >
              <Text style={styles.buttonTitle}>{intlData.messages.Settings.docButton}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showClearDialog}
              style={styles.button}
            >
              <Text style={styles.buttonTitle}>{intlData.messages.Settings.debugMessage}</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={styles.bottom}>          
          <CustomAlertTwoButtons
            title="⚠️"
            message={intlData.messages.Settings.clearCases2}
            visible={alertVisibleClear}
            onConfirm={() => {
              clear();
              setAlertVisibleClear(false); 
            }}
            onCancel={() => setAlertVisibleClear(false)}
            confirmButtonText={intlData.messages.yes}
            cancelButtonText={intlData.messages.no}
          />
          <CustomAlert
            title="✅"
            message={intlData.messages.Settings.userIDRegistered}
            onConfirm={() => setAlertVisibleUserID(false)}
            visible={alertVisibleUserID}
          />
          <CustomAlert
            title="✅"
            message={intlData.messages.Settings.emailRegistered}
            onConfirm={() => setAlertVisibleEmailCorrect(false)}
            visible={alertVisibleEmailCorrect}
          />
          <CustomAlert
            title="❌"
            message={intlData.messages.Settings.emailParsingError}
            onConfirm={() => setAlertVisibleEmailError(false)}
            visible={alertVisibleEmailError}
          />
          <CustomAlertTwoButtons
            title="❌"
            message={intlData.messages.Settings.missingIcons}
            visible={alertVisibleMissingIcons}
            onConfirm={() => {
              setAlertVisibleMissingIcons(false); 
            }}
            onCancel={() => {
              openDocumentation();
              setAlertVisibleMissingIcons(false);
            }}
            confirmButtonText={intlData.messages.Settings.missingIconsConfirm}
            cancelButtonText={intlData.messages.Settings.missingIconsOpenDoc}
          />
          <CustomAlert
            title="✅"
            message={intlData.messages.Settings.savedIconUrl}
            onConfirm={() => setAlertVisibleUrl(false)}
            visible={alertVisibleUrl}
          />
          <CustomAlertTwoButtons
            title="❌"
            message={intlData.messages.Settings.downloadError}
            visible={alertVisibleDownloadError}
            onConfirm={() => {
              setAlertVisibleDownloadError(false); 
            }}
            onCancel={() => {
              openDocumentation();
              setAlertVisibleDownloadError(false);
            }}
            confirmButtonText={intlData.messages.Settings.missingIconsConfirm}
            cancelButtonText={intlData.messages.Settings.missingIconsOpenDoc}
          />
          <CustomAlert
            title="✅"
            message={intlData.messages.Settings.downloadSuccess}
            onConfirm={() => setAlertVisibleDownloadCorrect(false)}
            visible={alertVisibleDownloadCorrect}
          />
          <CustomAlert
            title="✅"
            message={intlData.messages.Settings.caseRegistered}
            onConfirm={() => setAlertVisibleCaseNumber(false)}
            visible={alertVisibleCaseNumber}
          />
        </View>
      </KeyboardAvoidingView>
    );
  };

const baseStyles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'space-between',
  },
  toggle: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginTop: 10,
    marginBottom : 10,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  bottom: {
    //marginBottom: 10,
    //marginTop: 20,
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
    marginTop: 5,
    marginBottom: 5,
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
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
    marginTop: 5,
    marginBottom: 5,
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  twoButtonsLeft: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    height: 40,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
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

function mapStateToProps(state) {
  return {
    theme: state.theme,
    images: state.image.image,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Settings);