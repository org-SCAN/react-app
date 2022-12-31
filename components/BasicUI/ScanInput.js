import { StyleSheet, TextInput } from "react-native";
import { connect } from "react-redux";

const ScanInput = (props) => {
  const styles = props.theme.mode === "light" ? lightStyle : darkStyle;
  if (props.style) {
    styles = { ...styles, ...props.style };
  }
  return (
    <TextInput
      style={styles.input}
      placeholder={props.placeholder || ""}
      placeholderTextColor={
        props.theme.mode === "light" ? "#B3B3B3" : "#B3B3B39C"
      }
      value={props.value || null}
      onChangeText={props.onChangeText || null}
      keyboardType={props.keyboardType || "default"}
    />
  );
};

const basicStyle = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    margin: 5,
    borderWidth: 1,
    padding: 10,
  },
});

const lightStyle = StyleSheet.create({
  ...basicStyle,
  input: {
    ...basicStyle.input,
    borderColor: "#000",
  },
});

const darkStyle = StyleSheet.create({
  ...basicStyle,
  input: {
    ...basicStyle.input,
    borderColor: "#fff",
    backgroundColor: "#333333",
  },
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}
export default connect(mapStateToProps)(ScanInput);
