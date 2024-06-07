import { StyleSheet, Text, Pressable, Image } from "react-native";
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

const basicStyles = StyleSheet.create({
  button: {
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
    width: 150,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
  },
  image: {
    width: 34,
    height: 34
    
  }
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
