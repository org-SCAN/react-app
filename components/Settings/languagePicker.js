import { connect, useDispatch } from "react-redux";
import { useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { updateLanguage } from "../../redux/actions";

const languagePicker = (props) => {
  const dispatch = useDispatch();
  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;
  const { intlData } = props;
  const [selectedValue, setSelectedValue] = useState(intlData.locale);
  
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
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

  const handleLanguageChange = (itemValue) => {
    dispatch(updateLanguage(itemValue));
    setSelectedValue(itemValue);
  }

  return (
    <View>
      <Text style={styles.mainText}>{intlData.messages.Settings.selectLanguage}</Text>
      <View style={styles.pickerWrapper}>
        {Platform.OS === "ios" ? (
          <PickerIOS
            selectedValue={selectedValue}
            onValueChange={handleLanguageChange}
            style={styles.pickerContainer}
            itemStyle={styles.itemStyle}
            themeVariant={props.theme.mode}
          >
            {options}
          </PickerIOS>  
        ) : (
          <Picker
            selectedValue={selectedValue}
            onValueChange={handleLanguageChange}
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
    //height: 100,
    borderColor: "pink",
    ...Platform.select({
      ios: {
        height: 100,
        justifyContent: "center",
      },
    }),
  },
};

const stylesLight = StyleSheet.create({
  ...baseStyles,
  mainText: {
    color: "black",
  },
  pickerWrapper: {
    ...baseStyles.pickerWrapper,
    borderColor: "black",
  },
  pickerItem: {
    color: "black",
  },
  itemStyle: {
    color: "black",
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
    borderColor: "black",
  },
  dropdownIconColor: "black",
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  mainText: {
    color: "white",
  },
  pickerItem: {
    color: "black",
  },
  itemStyle: {
    color: "white",
  },
  pickerWrapper: {
    ...baseStyles.pickerWrapper,
    borderColor: "white",
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
    borderColor: "pink",
    color: "white",
  },
  dropdownIconColor: "white",
});


function mapStateToProps(state) {
  return {
    intlData: state.lang,
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(languagePicker);
