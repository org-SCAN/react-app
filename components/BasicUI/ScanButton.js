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

const stylesLight = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "grey",
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "black",
  },
});

const stylesDark = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#BF0413",
    borderWidth: 2,
    borderColor: "grey",
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(ScanButton);
