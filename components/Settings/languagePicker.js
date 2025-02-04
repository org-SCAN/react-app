import { connect } from "react-redux";
import { useState } from "react";
import { THEME_COLOR } from "../../theme/constants";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { handleLanguageChange } from "./SettingsHandler";

const languagePicker = (props) => {
  const { intlData, dispatch, theme } = props;
  const styles = theme.mode == "dark" ? stylesDark : stylesLight;
  const [selectedValue, setSelectedValue] = useState(intlData.locale);
  
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "ar", name: "العربية" }
  ];
  const options = languages.map((language) => {
    return (
      <Picker.Item
        value={language.code}
        key={language.code}
        label={language.name}
        style={styles.pickerItem}
      />
    );
  });

  return (
    <View>
      <Text style={styles.mainText}>{intlData.messages.Settings.selectLanguage}</Text>
      <View style={styles.pickerWrapper}>
        {Platform.OS === "ios" ? (
          <PickerIOS
            selectedValue={selectedValue}
            onValueChange={(itemValue) => handleLanguageChange(dispatch, itemValue, setSelectedValue)}
            style={styles.pickerContainer}
            itemStyle={styles.itemStyle}
            themeVariant={props.theme.mode}
          >
            {options}
          </PickerIOS>  
        ) : (
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => handleLanguageChange(dispatch, itemValue, setSelectedValue)}
            style={styles.pickerContainer}
            mode={'dropdown'}
            dropdownIconColor={styles.dropdownIconColor}
          >
            {options}
          </Picker>
        )}
      </View>
    </View>
  );
};

const baseStyles = {
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
  },
  pickerContainer: {
    ...Platform.select({
      ios: {
        height: 100,
        justifyContent: "center",
      },
    }),
  },
  mainText: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 15,
  },
};

const stylesLight = StyleSheet.create({
  ...baseStyles,
  mainText: {
    ...baseStyles.mainText,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  pickerWrapper: {
    ...baseStyles.pickerWrapper,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
  },
  pickerItem: {
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
  },
  itemStyle: {
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  dropdownIconColor: THEME_COLOR.LIGHT.DROPDOWN_ICON_COLOR,
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  mainText: {
    ...baseStyles.mainText,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  pickerItem: {
    color: THEME_COLOR.DARK.INPUT_TEXT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
  },
  itemStyle: {
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  pickerWrapper: {
    ...baseStyles.pickerWrapper,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  dropdownIconColor: THEME_COLOR.DARK.DROPDOWN_ICON_COLOR,
});


function mapStateToProps(state) {
  return {
    intlData: state.lang,
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(languagePicker);
