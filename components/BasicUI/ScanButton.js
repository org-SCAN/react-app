import { StyleSheet, Text, TouchableOpacity } from "react-native";

const ScanButton = (props) => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.title || "default"}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default ScanButton;
