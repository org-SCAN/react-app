import { connect } from "react-redux";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { THEME_COLOR } from "../../theme/constants";

const EthnicityField = (props) => {
  const { intlData, theme, style, value, onChangeText, onBlur } = props;
  const styles = theme.mode === "dark" ? stylesDark : stylesLight;

  return (
    <View style={[styles.inputContainer, { zIndex: -1 }]}>
      <Text style={styles.placeholder}>{intlData.messages.Case.ethnicity || "Ethnicité"}</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          placeholder="Entrez l'ethnicité..."
          placeholderTextColor={styles.placeholderText.color}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
        />
      </View>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
  },
  placeholder: {
    marginBottom: 7,
    marginTop: 7,
    fontSize: 17,
    fontWeight: "bold",
  },
  textInputContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
    minHeight: 40,
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  placeholder: {
    ...baseStyles.placeholder,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  placeholderText: {
    color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER,
  },
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  placeholder: {
    ...baseStyles.placeholder,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  placeholderText: {
    color: THEME_COLOR.DARK.INPUT_PLACE_HOLDER,
  },
});

function mapStateToProps(state) {
  return {
    intlData: state.lang,
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(EthnicityField);
