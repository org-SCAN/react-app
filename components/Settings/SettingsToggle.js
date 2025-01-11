import { StyleSheet, View, Text, Switch } from "react-native";
import { connect } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";


const SettingsToggle = (props) => {
  const mainStyle = { ...props.style, ...baseStyles.settingsLine };

  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;

  return (
    <View style={mainStyle}>
      <View>
        <Text style={styles.mainText}>{props.title || "default"}</Text>
        <Text style={styles.description}>{props.description || "None"}</Text>
      </View>
      <View>
        <Switch {...props} trackColor={{ true: THEME_COLOR.DARK.SETTINGS_BUTTON_BACKGROUND, false: "grey" }}/>
      </View>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  settingsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const stylesLight = StyleSheet.create({
  mainText: {
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
    fontSize: 25,
  },
  description: {
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
    fontStyle: "italic",
    fontSize: 17,
  },
});

const stylesDark = StyleSheet.create({
  mainText: {
    color: THEME_COLOR.DARK.MAIN_TEXT,
    fontSize: 25,
  },
  description: {
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
    fontStyle: "italic",
    fontSize: 17,
  },
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(SettingsToggle);
