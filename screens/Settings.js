import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Text, TextInput, Alert, TouchableWithoutFeedback, Linking } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateUserId, updateCaseNumber, setIcons } from "../redux/actions";
import { clearImage, clearCase } from "../redux/actions";
import SettingsToggle from "../components/Settings/SettingsToggle";
import { SCAN_COLOR } from "../theme/constants";
import { showConfirmDialog } from "../components/Settings/ConfirmDialog";
import { switchMode, updateLanguage } from "../redux/actions";
import { connect } from "react-redux";
import { deleteCameraCache } from "../utils/cacheManager";
import { deleteAll } from "../utils/fileHandler";
import LanguagePicker from "../components/Settings/languagePicker";
import { KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import JSZip from 'jszip';


const Settings = (props) => {
  const { intlData } = props;
  const dispatch = useDispatch();
  const [showBox, setShowBox] = useState(true);
  const [userId, setUserId] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState(0);
  const [serverUrl, setServerUrl] = useState("");

  const storedUserId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);

//load new icons

    const handleLoadIcons = async () => {
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.zip],
          });
          const zipFile = res[0];
          await loadIconsFromZip(zipFile, dispatch, 'sex');
          await loadIconsFromZip(zipFile, dispatch, 'age');
          navigation.goBack();
        } catch (err) {
          if (DocumentPicker.isCancel(err)) {
            console.warn('User cancelled the picker');
          } else {
            throw err;
          }
        }
    };
    `
  const loadIconsFromZip = async (zipFile, dispatch, key) => {
    const zip = await JSZip.loadAsync(zipFile);
    const newIcons = [];

    for (const fileName of Object.keys(zip.files)) {
      const file = zip.files[fileName];
      const data = await file.async('blob');
      const iconUrl = URL.createObjectURL(data);
      const iconName = fileName.replace(/\.[^/.]+$/, ""); // remove file extension

      newIcons.push({ name: iconName, icon: iconUrl });
    }

    dispatch(setIcons(key, newIcons));
  };

  //handle reset casenumber
  const handleUpdateCaseNumber = (newCaseNumber) => {
    dispatch(updateCaseNumber(newCaseNumber));
    Alert.alert("Success", "New case number has been saved!");
  };

  // Handle changing the theme mode
  const handleThemeChange = () => {
    dispatch(switchMode(props.theme.mode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [storedUserId]);

  const clear = () => {
    setShowBox(false);
    deleteAll();
    dispatch(clearImage());
    dispatch(clearCase());
    deleteCameraCache();
  };

  const handleSaveUserId = () => {
    dispatch(updateUserId(userId));
    Alert.alert("Success", "User ID has been saved!");
  };

  //Lien serveur pour changer les icones
 const OpenServerUrl = () => {
    if (serverUrl.trim() !== '') {
      Linking.openURL(serverUrl)
        .catch(err => {
          console.error('Failed to open URL:', err);
          Alert.alert('Error', 'Failed to open the server URL.');
        });
    } else {
      Alert.alert('Error', 'Please enter a valid server URL.');
    }
  };

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


            <View style={styles.serverUrlContainer}>

              <Button
                title={intlData.messages.Settings.loadIcons}
                onPress={handleLoadIcons}
                color={SCAN_COLOR}
              />
            </View>
            <View style={styles.userIdContainer}>
              <Text style={styles.label}></Text>
              <TextInput
                placeholder={intlData.messages.Settings["enterUserID"]}
                style={styles.input}
                keyboardType="alphanumeric"
                maxLength={10}
                value={userId}
                onChangeText={setUserId}
              />
              <Button
                title={intlData.messages.Settings.saveUserID}
                onPress={handleSaveUserId}
                color={SCAN_COLOR}
              />
              {storedUserId ? <Text>Stored User ID: {storedUserId}</Text> : null}
            </View>
            <View style={styles.userIdContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder={intlData.messages.Settings["newCaseNumber"]}
                onChangeText={(text) => setNewCaseNumber(parseInt(text))}
              />
              <Button
                title={intlData.messages.Settings.resetCaseNumber}
                onPress={() => handleUpdateCaseNumber(newCaseNumber)}
                color={SCAN_COLOR}
              />
              {caseNumber ? <Text>Stored Case number: {caseNumber}</Text> : null}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={styles.bottom}>
          <Text style={styles.hint}>Debug</Text>
          <Button
            title={intlData.messages.Settings.debugMessage}
            color={SCAN_COLOR}
            onPress={() =>
              showConfirmDialog(
                intlData.messages.Settings.clearCases1,
                intlData.messages.Settings.clearCases2,
                clear
              )
            }
          />
        </View>
      </KeyboardAvoidingView>
    );
  };

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    margin: 30,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  toggle: {
    marginBottom: 20,
  },
  hint: {
    fontStyle: "italic",
    color: "#B3B3B3",
    textAlign: "center",
    marginTop: 20,
  },
  userIdContainer: {
    marginTop: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  bottom: {
    //marginBottom: 10,
    marginTop: 140,
  },
  serverUrlContainer: {
    marginTop: 20,
  },
  description: {
    marginBottom: 10,
    fontSize: 17,
    color: "black",},
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
    images: state.image.image,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Settings);