import { connect } from "react-redux";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { THEME_COLOR } from "../../theme/constants";

const LabeledTextInput = (props) => {
  const {
    intlData, theme,
    label, placeholder,
    value, onChangeText, onBlur,
    multiline = false,
    numberOnly = false,
    maxLength,
    textAlignVertical,
    minHeight,
    containerStyle,
  } = props;

  const styles = theme.mode === "dark" ? stylesDark : stylesLight;

  const handleChange = (text) => {
    if (numberOnly) {
      const numeric = text.replace(/[^0-9]/g, "");
      onChangeText?.(numeric);
    } else {
      onChangeText?.(text);
    }
  };

  return (
    <View style={[styles.inputContainer, { zIndex: -1 }, containerStyle]}>
      <Text style={styles.placeholder}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={styles.placeholderText.color}
        style={[styles.input, minHeight ? { minHeight } : null]}
        value={value}
        onChangeText={handleChange}
        onBlur={onBlur}
        multiline={multiline}
        scrollEnabled={false}
        textAlignVertical={textAlignVertical}
        keyboardType={numberOnly ? "numeric" : "default"}
        maxLength={maxLength}
      />
    </View>
  );
};

const baseStyles = StyleSheet.create({
  inputContainer: { marginVertical: 5 },
  placeholder: { marginBottom: 7, marginTop: 7, fontSize: 17, fontWeight: "bold" },
  input: {
    width: "100%", marginVertical: 5, borderWidth: 1, borderRadius: 5,
    shadowOffset: { width: 1, height: 1 }, shadowOpacity: 0.1,
    paddingLeft: 8, paddingTop: 8, paddingBottom: 8, minHeight: 40,
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  placeholder: { ...baseStyles.placeholder, color: THEME_COLOR.LIGHT.MAIN_TEXT },
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  placeholderText: { color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER },
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  placeholder: { ...baseStyles.placeholder, color: THEME_COLOR.DARK.MAIN_TEXT },
  input: {
    ...baseStyles.input,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  placeholderText: { color: THEME_COLOR.DARK.INPUT_PLACE_HOLDER },
});

function mapStateToProps(state) {
  return { intlData: state.lang, theme: state.theme };
}

export default connect(mapStateToProps)(LabeledTextInput);
