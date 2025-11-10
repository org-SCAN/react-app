import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";

const LabeledTextInput = (props) => {
  const {
    theme,
    label,
    placeholder,
    value,
    onChangeText,
    maxLength,
    numeric = false,
    multiline,
    keyboardType="default",
    textAlignVertical,
  } = props;

  const styles = theme.mode === "dark" ? stylesDark : stylesLight;

  const handleChange = (text) => {
    if (numeric) {
      // Ne permettre que les chiffres
      const numericValue = text.replace(/[^0-9]/g, '').slice(0, maxLength || 3);
      onChangeText(numericValue);
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        maxLength={maxLength}
        multiline={multiline}
        keyboardType={numeric ? "numeric" : keyboardType}
        textAlignVertical={textAlignVertical}
      />
    </View>
  );
};

const baseStyles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 7,
    marginTop: 7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    paddingTop: 8,
    paddingBottom: 8,
  },
  placeholder: {
    color: "#999999",
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  input: {
    ...baseStyles.input,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  label: {
    ...baseStyles.label,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  placeholder: {
    color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER,
  },
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  input: {
    ...baseStyles.input,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    borderColor: THEME_COLOR.DARK.INPUT,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  label: {
    ...baseStyles.label,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  placeholder: {
    color: THEME_COLOR.DARK.INPUT_PLACE_HOLDER,
  },
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(LabeledTextInput);


