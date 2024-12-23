import { StyleSheet, View, Text, Switch } from "react-native";
import { connect } from "react-redux";

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
        <Switch {...props} trackColor={{ true: "#BF0413", false: "grey" }}/>
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
    color: "#000",
    fontSize: 25,
  },
  description: {
    color: "#666",
    fontStyle: "italic",
    fontSize: 17,
  },
});

const stylesDark = StyleSheet.create({
  mainText: {
    color: "#fff",
    fontSize: 25,
  },
  description: {
    color: "#ccc",
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
