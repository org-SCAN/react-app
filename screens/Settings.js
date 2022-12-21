import React from "react";
import { StyleSheet, View } from "react-native";
import ToggleSetting from "../components/Settings/ToggleSetting";

class Settings extends React.Component {
  render() {
    return (
      <View style={styles.mainContent}>
        <ToggleSetting
          title="Dark Mode"
          description="Toggle dark mode"
          storageKey="darkMode"
          style={styles.toggle}
        />
        <ToggleSetting
          title="Super User Mode"
          description="Desactivate security features"
          storageKey="superUserMode"
          style={styles.toggle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    margin: 30,
  },
  toggle: {
    marginBottom: 20,
  },
});

export default Settings;
