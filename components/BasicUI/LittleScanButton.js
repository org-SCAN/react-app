import { StyleSheet, Text, Pressable, Dimensions } from "react-native";
import { connect } from "react-redux";

const LittleScanButton = (props) => {
  var styles = props.theme.mode === "light" ? stylesLight : stylesDark;
  if (props.style) {
    styles.button = { ...styles.button, ...props.style };
  }
  return (
    <Pressable style={styles.button} onPress={props.onPress}>
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
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  text: {
    fontSize: scale(16),
    lineHeight: 21,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const stylesLight = StyleSheet.create({
  ...basicStyles,
  button: {
    ...basicStyles.button,
    backgroundColor: "white",
    borderColor: "grey",
  },
  text: {
    ...basicStyles.text,
    color: "black",
  },
});

const stylesDark = StyleSheet.create({
  ...basicStyles,
  button: {
    ...basicStyles.button,
    backgroundColor: "grey",
    borderColor: "grey",
  },
  text: {
    ...basicStyles.text,
    color: "white",
  },
});

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(LittleScanButton);
