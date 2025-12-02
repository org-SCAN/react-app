import React, { useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import SettingsToggle from "../components/Settings/SettingsToggle";
import { connect } from "react-redux";
import { openDocumentation } from "../components/Settings/SettingsHandler";
import LanguagePicker from "../components/Settings/languagePicker";
import SettingsForm from "../components/Settings/SettingsForm";
import SettingsAlerts from "../components/Settings/SettingsAlerts";
import SettingsButton from "../components/Settings/SettingsButton";
import { KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
import { THEME_COLOR } from "../theme/constants";

const Settings = (props) => {
  const { intlData, theme } = props;
  const styles = theme.mode === "dark" ? stylesDark : stylesLight;

  const [activeTab, setActiveTab] = useState("preferences"); // "preferences" ou "admin"
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
    configLoadSuccess: false,      
    configLoadError: false,        
    configErrorMessage: null,
  });

  const preferencesLabel = intlData.messages.Settings?.preferences;
  const adminLabel = intlData.messages.Settings?.admin;

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
      
      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "preferences" && styles.activeTab]}
          onPress={() => setActiveTab("preferences")}
        >
          <Text style={[styles.tabText, activeTab === "preferences" && styles.activeTabText]}>
            {preferencesLabel}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "admin" && styles.activeTab]}
          onPress={() => setActiveTab("admin")}
        >
          <Text style={[styles.tabText, activeTab === "admin" && styles.activeTabText]}>
            {adminLabel}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent} 
          automaticallyAdjustKeyboardInsets={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "preferences" ? (
            // Contenu de l'onglet Préférences
            <>
              <SettingsToggle
                title={intlData.messages.Settings.lightTheme}
                description={intlData.messages.Settings.themeDescription}
                {...props}
              />
              <LanguagePicker />
            </>
          ) : (
            // Contenu de l'onglet Configuration (Admin)
            <>
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
            </>
          )}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mainContent: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 25,
    justifyContent: 'flex-start',
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "700",
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  mainContent: {
    ...baseStyles.mainContent,
    backgroundColor: THEME_COLOR.LIGHT.BACKGROUND,
  },
  tabContainer: {
    ...baseStyles.tabContainer,
    backgroundColor: THEME_COLOR.LIGHT.BACKGROUND,
    borderBottomColor: THEME_COLOR.LIGHT.BUTTON_BORDER,
  },
  tab: {
    ...baseStyles.tab,
    backgroundColor: THEME_COLOR.LIGHT.BACKGROUND,
  },
  activeTab: {
    ...baseStyles.activeTab,
    borderBottomColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BACKGROUND,
  },
  tabText: {
    ...baseStyles.tabText,
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
  },
  activeTabText: {
    ...baseStyles.activeTabText,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  mainContent: {
    ...baseStyles.mainContent,
    backgroundColor: THEME_COLOR.DARK.BACKGROUND,
  },
  tabContainer: {
    ...baseStyles.tabContainer,
    backgroundColor: THEME_COLOR.DARK.BACKGROUND,
    borderBottomColor: THEME_COLOR.DARK.BUTTON_BORDER,
  },
  tab: {
    ...baseStyles.tab,
    backgroundColor: THEME_COLOR.DARK.BACKGROUND,
  },
  activeTab: {
    ...baseStyles.activeTab,
    borderBottomColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BACKGROUND,
  },
  tabText: {
    ...baseStyles.tabText,
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
  },
  activeTabText: {
    ...baseStyles.activeTabText,
    color: THEME_COLOR.DARK.MAIN_TEXT,
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