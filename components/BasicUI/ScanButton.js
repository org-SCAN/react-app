import { StyleSheet, Text, Pressable, Image } from "react-native";
import { connect } from "react-redux";
import { Icon } from "@rneui/themed";
import { THEME_COLOR } from "../../theme/constants";


const ScanButton = (props) => {
  var styles = props.theme.mode === "light" ? stylesLight : stylesDark;
  if (props.style) {
    styles.button = { ...styles.button, ...props.style };
  }
  return (
    <Pressable style={styles.button} onPressIn={props.onPress}>
      <Icon 
       name={props.description === "case" ? "create-new-folder" : "folder-search"} 
       size={45}
       color={props.theme.mode === "light" ? THEME_COLOR.LIGHT.BUTTON_TEXT : THEME_COLOR.DARK.BUTTON_TEXT} 
       type={props.description === "case" ? "material-icons" : "material-community"} 
      />
      <Text style={styles.text}>{props.title || "default"}</Text>
    </Pressable>
  );
};

const basicStyles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
    width: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
  },
  
});

const stylesLight = StyleSheet.create({
  ...basicStyles,
  button: {
    ...basicStyles.button,
    backgroundColor: THEME_COLOR.LIGHT.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.BUTTON_BORDER,
    shadowColor: THEME_COLOR.LIGHT.BUTTON_SHADOW,
  },
  text: {
    ...basicStyles.text,
    color: THEME_COLOR.LIGHT.BUTTON_TEXT,
  },
});

const stylesDark = StyleSheet.create({
  ...basicStyles,
  button: {
    ...basicStyles.button,
    backgroundColor: THEME_COLOR.DARK.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.BUTTON_BORDER,
    shadowColor: THEME_COLOR.DARK.BUTTON_SHADOW,
  },
  text: {
    ...basicStyles.text,
    color: THEME_COLOR.DARK.BUTTON_TEXT,
  },
});

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(ScanButton);
