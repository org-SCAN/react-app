import { connect } from "react-redux";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { THEME_COLOR } from "../../theme/constants";

const SimplePicker = (props) => {
  const { intlData, theme, style, items, selectedValue, setSelectedValue, placeholder, isOpen, onOpen, onClose } = props;
  const styles = theme.mode === "dark" ? stylesDark : stylesLight;
  
  const [pickerItems, setPickerItems] = useState(items);
  
  const handleChange = (value) => {
    setSelectedValue(value);
    onClose();
  };

  const handleOpen = () => {
    onOpen();
  };

  return (
    <View style={{ zIndex: isOpen ? 9999 : 1 }}>
      <Text style={styles.mainText}>{placeholder}</Text>
      <DropDownPicker
        listMode="SCROLLVIEW"
        placeholder={intlData.messages.Case.sexPlaceholder}
        placeholderStyle={styles.placeholder}
        textStyle={styles.inputText}
        multiple={false}
        theme={theme.mode === "dark" ? "DARK" : "LIGHT"}
        open={isOpen}
        value={selectedValue}
        items={pickerItems}
        setOpen={handleOpen}
        setValue={setSelectedValue}
        setItems={setPickerItems}
        onChangeValue={handleChange}
        listItemLabelStyle={styles.pickerListItem}
        style={styles.pickerContainer}
        dropDownContainerStyle={styles.dropDownContainer}
        listMessageContainerStyle={styles.listMessageContainerStyle}
        listMessageTextStyle={styles.listMessageTextStyle}
        zIndex={9999}
        zIndexInverse={9999}
        ListEmptyComponent={({ listMessageContainerStyle, listMessageTextStyle }) => (
          <View style={listMessageContainerStyle}>
              <Text style={listMessageTextStyle}>
                Aucune option disponible
              </Text>
          </View>
        )}
      />
    </View>
  );
};

const baseStyles = {
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
  },
  dropDownContainer: {
    borderRadius: 5,
    zIndex: 9999,
    elevation: 9999, // Android
  },

  mainText: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 7,
    marginTop: 7,
  },

  listMessageContainerStyle: {
    padding: 20,
  },
  listMessageTextStyle: {
    textAlign: "center",
  },
  pickerListItem: {},
};

const stylesLight = StyleSheet.create({
  ...baseStyles,
  pickerContainer: {
    ...baseStyles.pickerContainer,
    borderColor: THEME_COLOR.LIGHT.BACKGROUND,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
  },
  dropDownContainer: {
    ...baseStyles.dropDownContainer,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    borderColor: THEME_COLOR.LIGHT.BACKGROUND,
  },
  listMessageTextStyle: {
    ...baseStyles.listMessageTextStyle,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  placeholder: {
    color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER,
  },
  pickerListItem: {
    ...baseStyles.pickerListItem,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  mainText: {
    ...baseStyles.mainText,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
});

const stylesDark = StyleSheet.create({
  ...baseStyles,
  pickerContainer: {
    ...baseStyles.pickerContainer,
    borderColor: THEME_COLOR.DARK.BACKGROUND,
    backgroundColor: THEME_COLOR.DARK.INPUT,
  },
  dropDownContainer: {
    ...baseStyles.dropDownContainer,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    borderColor: THEME_COLOR.DARK.BACKGROUND,
  },
  listMessageTextStyle: {
    ...baseStyles.listMessageTextStyle,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  placeholder: {
    color: THEME_COLOR.DARK.INPUT_PLACE_HOLDER,
  },
  pickerListItem: {
    ...baseStyles.pickerListItem,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  mainText: {
    ...baseStyles.mainText,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
});

function mapStateToProps(state) {
  return {
    intlData: state.lang,
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(SimplePicker);