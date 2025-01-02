import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, TextInput, Alert, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUserId, updateCaseNumber, updateEmail } from "../redux/actions";
import { clearImage, clearCase } from "../redux/actions";
import SettingsToggle from "../components/Settings/SettingsToggle";
import { SCAN_COLOR } from "../theme/constants";
import CustomAlert from "../components/Case/CustomAlert";
import CustomAlertTwoButtons from "../components/Case/CustomAlertTwoButtons";
import { switchMode, updateLanguage } from "../redux/actions";
import { connect } from "react-redux";
import { deleteCameraCache } from "../utils/cacheManager";
import { deleteAll } from "../utils/fileHandler";
import LanguagePicker from "../components/Settings/languagePicker";
import { KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import store from "../redux/store";
//import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const Settings = (props) => {
  const { intlData } = props;
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(true);

  const [userId, setUserId] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState(0);
  const [email, setEmail] = useState('');

  const storedUserId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const storedEmail = useSelector(state => state.email.email);

  const [alertVisibleUserID, setAlertVisibleUserID] = useState(false);
  const [alertVisibleEmailCorrect, setAlertVisibleEmailCorrect] = useState(false);
  const [alertVisibleEmailError, setAlertVisibleEmailError] = useState(false);
  const [alertVisibleCaseNumber, setAlertVisibleCaseNumber] = useState(false); 
  const [alertVisibleClear, setAlertVisibleClear] = useState(false);

  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;

  //handle new casenumber
  const handleUpdateCaseNumber = (newCaseNumber) => {
    dispatch(updateCaseNumber(newCaseNumber));
    setAlertVisibleCaseNumber(true);
  };

  const showClearDialog = () => {
    setAlertVisibleClear(true);
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
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
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

            <View style={styles.userIdContainer}> 
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
            <View style={styles.userIdContainer}>
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
            <View style={styles.userIdContainer}> 
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
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={styles.bottom}>
          <Text style={styles.hint}>Debug</Text>
          <TouchableOpacity
            onPress={showClearDialog}
            style={styles.button}
          >
            <Text style={styles.buttonTitle}>{intlData.messages.Settings.debugMessage}</Text>
          </TouchableOpacity>
          
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
    margin: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  toggle: {
    //marginBottom: 20,
  },
  userIdContainer: {
    //marginTop: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  bottom: {
    //marginBottom: 10,
    marginTop: 20,
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
    backgroundColor: SCAN_COLOR,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: SCAN_COLOR
  },
  buttonTitle: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16,
  },
  hint: {
    fontStyle: "italic",
    textAlign: "center",
    //marginTop: 20,
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  hint: {
    ...baseStyles.hint,
    color: "#B3B3B3",
  },
  input: {
    ...baseStyles.input,
    borderColor: "gray",
    color: "black",
  },
  placeholder: {
    color: "#B3B3B3",
  },
  details: {
    color: "gray",
  }
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  hint: {
    ...baseStyles.hint,
    color: "#B3B3B3",
  },
  input: {
    ...baseStyles.input,
    borderColor: "white",
    color: "white",
  },
  placeholder: {
    color: "#B3B3B3",
  },
  details: {
    color: "gray",
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