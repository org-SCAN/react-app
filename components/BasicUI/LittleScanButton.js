import { StyleSheet, Text, Pressable, Dimensions } from "react-native";
import { connect } from "react-redux";
import { Icon } from "@rneui/themed";
import { THEME_COLOR } from "../../theme/constants";


const LittleScanButton = (props) => {
  var styles = props.theme.mode === "light" ? stylesLight : stylesDark;
  if (props.style) {
    styles.button = { ...styles.button, ...props.style };
  }
  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      <Icon 
       name={props.description === "save" ? "save-alt" : "email"} 
       size={30} 
       color={props.theme.mode === "light" ? THEME_COLOR.LIGHT.BUTTON_TEXT : THEME_COLOR.DARK.BUTTON_TEXT}  
       type={props.description === "save" ? "material-icons" : "material-icons-outlined"} 
      />
      <Text style={styles.text}>{props.title || "default"}</Text>
    </Pressable>
  );
};

const { width, height } = Dimensions.get("window");
// Reference emulated device
const baseWidth = 375; 
const baseHeight = 812; 

function scaleWidth(size) {
  return Math.round((width / baseWidth) * size);
}

function scaleHeight(size) {
  return Math.round((height / baseHeight) * size);
}

function scale(size) {
  return Math.round((size * (width / baseWidth + height / baseHeight)) / 2);
}

const basicStyles = StyleSheet.create({
  button: {
    borderRadius: 2,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
    width: scaleWidth(160),
    height: scaleHeight(50),
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  text: {
    fontSize: scale(13),
    lineHeight: 21,
    fontWeight: "bold",
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

export default connect(mapStateToProps)(LittleScanButton);
