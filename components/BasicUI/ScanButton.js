import { StyleSheet, Text, Pressable, Image } from "react-native";
import { connect } from "react-redux";
import { Icon } from "@rneui/themed";


const ScanButton = (props) => {
  var styles = props.theme.mode === "light" ? stylesLight : stylesDark;
  if (props.style) {
    styles.button = { ...styles.button, ...props.style };
  }
  return (
    <Pressable style={styles.button} onPress={props.onPress}>
      <Icon 
       name={props.description === "case" ? "create-new-folder" : "folder-search"} 
       size={45} 
       color={props.theme.mode === "light" ? "black" : "white"} 
       type={props.description === "case" ? "material-icons" : "material-community"} 
      />
      <Text style={styles.text}>{props.title || "default"}</Text>
    </Pressable>
  );
};

const basicStyles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
    width: 200,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
  },
  
});

const stylesLight = StyleSheet.create({
  ...basicStyles,
  button: {
    ...basicStyles.button,
    backgroundColor: "white",
    borderColor: "grey",
    shadowColor: "black",
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
    shadowColor: "grey",
  },
  text: {
    ...basicStyles.text,
    color: "white",
  }
});

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(ScanButton);
