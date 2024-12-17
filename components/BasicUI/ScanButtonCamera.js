import { StyleSheet, Text, Pressable, Image, Dimensions } from "react-native";
import { connect } from "react-redux";

const ScanButtonCamera = (props) => {
  var styles = props.theme.mode === "light" ? stylesLight : stylesDark;
  if (props.style) {
    styles.button = { ...styles.button, ...props.style };
  }
  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      <Image source={props.imageSource} style={styles.image}/>
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
    paddingHorizontal: scaleWidth(10), 
    borderRadius: scale(4), 
    elevation: 3,
    borderWidth: scaleWidth(2), 
    margin: scale(10),
    width: scaleWidth(150), 
    shadowColor: "black",
    shadowOffset: { width: scaleWidth(1), height: scaleHeight(1) }, 
    shadowOpacity: 0.4,
  },
  text: {
    fontSize: scale(16),
    lineHeight: scaleHeight(21),
    fontWeight: "bold",
    letterSpacing: scaleWidth(0.25),
    textAlign: "center",
  },
  image: {
    width: scaleWidth(34), 
    height: scaleHeight(34),
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
  }
});

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(ScanButtonCamera);
