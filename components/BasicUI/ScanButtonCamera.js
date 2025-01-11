import { StyleSheet, Text, Pressable, Image, Dimensions } from "react-native";
import { connect } from "react-redux";
import { Icon } from "@rneui/themed";
import { THEME_COLOR } from "../../theme/constants";



const ScanButtonCamera = (props) => {
  var styles = props.theme.mode === "light" ? stylesLight : stylesDark;
  if (props.style) {
    styles.button = { ...styles.button, ...props.style };
  }
  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      <Icon 
       name="add-a-photo" 
       size={34}
       style={styles.image} 
       color={props.theme.mode === "light" ? THEME_COLOR.LIGHT.BUTTON_TEXT : THEME_COLOR.DARK.BUTTON_TEXT} 
       type="material-icons"
      />
    </Pressable>
  );
};

const { width, height } = Dimensions.get("window");
// Reference emulated device
const baseWidth = 411.42857142857144; 
const baseHeight = 890.2857142857143; 

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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleHeight(5), 
    borderRadius: scale(4), 
    elevation: 3,
    borderWidth: scaleWidth(2), 
    marginBottom: scale(10),
    width: scaleWidth(150), 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  text: {
    fontSize: scale(16),
    lineHeight: scaleHeight(21),
    fontWeight: "bold",
    letterSpacing: scaleWidth(0.25),
    textAlign: "center",
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
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

export default connect(mapStateToProps)(ScanButtonCamera);
