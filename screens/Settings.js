import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import SettingsToggle from "../components/Settings/SettingsToggle";
import { connect } from "react-redux";
import { openDocumentation } from "../components/Settings/SettingsHandler";
import LanguagePicker from "../components/Settings/languagePicker";
import SettingsForm from "../components/Settings/SettingsForm";
import SettingsAlerts from "../components/Settings/SettingsAlerts";
import SettingsButton from "../components/Settings/SettingsButton";
import { KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';

const Settings = (props) => {
  const { intlData } = props;
  const styles = baseStyles;

  const [loading, setLoading] = useState(false);
  const [alertStates, setAlertStates] = useState({
    clearWarning: false,
    userIdUpdate: false,
    emailCorrect: false,
    emailError: false,
    caseNumberUpdate: false,
    iconsDownloadCorrect: false,
    iconsDownloadError: false,
    iconsMissing: false,
    typesDownloadCorrect: false,
    typesDownloadError: false,
    typesMissing: false,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.mainContent}
    >
      {loading && (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}  
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          automaticallyAdjustKeyboardInsets={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <SettingsToggle
            title={intlData.messages.Settings.lightTheme}
            description={intlData.messages.Settings.themeDescription}
            {...props}
          />
          <LanguagePicker />
          <SettingsForm
            setAlertStates={setAlertStates}
            setLoading={setLoading}
            {...props}
          />
          <SettingsButton
            onPress={() => setAlertStates((prev) => ({ ...prev, clearWarning: true }))}
            buttonText={intlData.messages.Settings.debugMessage}
            {...props}
          />
          <SettingsButton
            onPress={openDocumentation}
            buttonText={intlData.messages.Settings.docButton}
            {...props}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
      <SettingsAlerts alertStates={alertStates} setAlertStates={setAlertStates} {...props}/>
    </KeyboardAvoidingView>
  );
};

const baseStyles = StyleSheet.create({
  activityContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'space-between',
  },
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
    images: state.image.image,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Settings);