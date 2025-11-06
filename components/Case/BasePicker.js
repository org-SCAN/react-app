import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { THEME_COLOR } from "../../theme/constants";

const BasePicker = (props) => {
  const {
    theme,
    label,
    dropdownPlaceholder,
    emptyText,
    isOpen,
    onOpen,
    onClose,
    items,
    setItems,
    value,
    setValue,
    multiple = false,
    mode,
    min,
    extendableBadgeContainer,
    showBadgeDot,
    renderBadgeItem,
  } = props;

  const styles = theme.mode === "dark" ? stylesDark : stylesLight;

  const handleSetOpen = (open) => {
    if (open) {
      if (onOpen) onOpen();
    } else {
      if (onClose) onClose();
    }
  };

  const handleChange = (val) => {
    if (setValue) setValue(val);
  };

  return (
    <View style={{ zIndex: isOpen ? 9999 : 1 }}>
      {!!label && <Text style={styles.mainText}>{label}</Text>}
      <DropDownPicker
        listMode="SCROLLVIEW"
        dropDownDirection="BOTTOM"
        placeholder={dropdownPlaceholder}
        placeholderStyle={styles.placeholder}
        textStyle={styles.inputText}
        multiple={multiple}
        min={min}
        theme={theme.mode === "dark" ? "DARK" : "LIGHT"}
        open={isOpen}
        mode={mode}
        value={value}
        items={items}
        extendableBadgeContainer={extendableBadgeContainer}
        showBadgeDot={showBadgeDot}
        renderBadgeItem={renderBadgeItem}
        setOpen={handleSetOpen}
        setValue={setValue}
        setItems={setItems}
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
            <Text style={listMessageTextStyle}>{emptyText}</Text>
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
    elevation: 9999,
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
  inputText: {},
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
  inputText: {
    ...baseStyles.inputText,
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
  inputText: {
    ...baseStyles.inputText,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  mainText: {
    ...baseStyles.mainText,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
});

export default BasePicker;


