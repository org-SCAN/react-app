import { StyleSheet, View, Text, Switch } from "react-native";
import { connect } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";
import { useState } from "react";
import { handleThemeChange } from "./SettingsHandler";

const SettingsToggle = (props) => {
  const { theme, dispatch } = props;
  const styles = theme.mode == "dark" ? stylesDark : stylesLight;

  const [isEnabled, setIsEnabled] = useState(theme.mode == "dark" ? true : false);

  return (
    <View style={styles.settingsLine}>
      <View>
        <Text style={styles.mainText}>{props.title}</Text>
        <Text style={styles.description}>{props.description}</Text>
      </View>
      <View>
        <Switch 
          trackColor={{ true: THEME_COLOR.DARK.SETTINGS_BUTTON_BACKGROUND, false: "grey" }}
          onValueChange={() => handleThemeChange(dispatch, isEnabled, setIsEnabled)}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  settingsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  mainText: {
    fontSize: 25,
  },
  description: {
    fontStyle: "italic",
    fontSize: 17,
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  mainText: {
    ...baseStyles.mainText,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  description: {
    ...baseStyles.description,
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
  },
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  mainText: {
    ...baseStyles.mainText,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  description: {
    ...baseStyles.description,
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
  },
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(SettingsToggle);
