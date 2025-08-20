import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { THEME_COLOR } from '../../theme/constants';

const SettingsButton = (props) => {
  const { buttonText, onPress, theme } = props;
  const styles = theme.mode == "dark" ? stylesDark : stylesLight;

  return (
    <TouchableOpacity
        onPress={onPress}
        style={styles.button}
    >
        <Text style={styles.buttonTitle}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const baseStyles = StyleSheet.create({
  button: {
    marginVertical: 5,
    height: 40,
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonTitle: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16,
  },
});

const stylesLight = StyleSheet.create({
  ...baseStyles,
  button: {
    ...baseStyles.button,
    backgroundColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.SETTINGS_BUTTON_BORDER,
  },
  buttonTitle: {
    ...baseStyles.buttonTitle,
    color: THEME_COLOR.LIGHT.SETTINGS_BUTTON_TEXT,
  }
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  button: {
    ...baseStyles.button,
    backgroundColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.SETTINGS_BUTTON_BORDER,
  },
  buttonTitle: {
    ...baseStyles.buttonTitle,
    color: THEME_COLOR.DARK.SETTINGS_BUTTON_TEXT,
  }
});

export default SettingsButton;
