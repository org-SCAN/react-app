import { StyleSheet, Text, Pressable } from "react-native";
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

const basicStyles = StyleSheet.create({
  button: {
    borderRadius: 2,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
    width: 175,
    height: 50,
    justifyContent: "center",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  text: {
    fontSize: 16,
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
