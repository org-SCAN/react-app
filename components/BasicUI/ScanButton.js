import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";

const ScanButton = (props) => {
  const styles = props.theme.mode === "light" ? stylesLight : stylesDark;
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.title || "default"}</Text>
    </TouchableOpacity>
  );
};

const basicStyles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
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

export default connect(mapStateToProps)(ScanButton);
