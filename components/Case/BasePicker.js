import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRef, useEffect } from "react";
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
    multiple,
    mode,
    min,
    extendableBadgeContainer,
    showBadgeDot,
    renderBadgeItem,
  } = props;

  const styles = theme.mode === "dark" ? stylesDark : stylesLight;
  
  // Use ref to always have the latest value for the updater function
  const valueRef = useRef(value);
  
  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  
  // For single select, DropDownPicker should automatically display the selected item's label
  // Verify that the value matches an item in the list
  useEffect(() => {
    if (!multiple && value !== null && value !== undefined && items.length > 0) {
      const foundItem = items.find(item => item.value === value);
      if (!foundItem) {
        console.warn(`BasePicker: Value "${value}" not found in items for single select`);
      }
    }
  }, [value, items, multiple]);

  const handleSetOpen = (open) => {
    if (open === isOpen) return;
    if (open) {
      if (onOpen) onOpen();
    } else {
      if (onClose) onClose();
    }
  };

  const handleChange = (val) => {
    if (setValue) {
      setValue(val);
    }
  };

  const handleSetValue = (updater) => {
    if (!setValue) return;
    try {
      // Use ref to get the latest value - this ensures the updater function always works with current data
      const currentValue = multiple 
        ? (Array.isArray(valueRef.current) ? valueRef.current : [])
        : valueRef.current;
      const next = typeof updater === "function" ? updater(currentValue) : updater;
      const sanitized =
      multiple ? (Array.isArray(next) ? next : []) : (next === "" ? null : next);
     setValue(sanitized);
    } catch (_) {
      // fallback: ignore
    }
  };

  return (
    <View style={{ zIndex: isOpen ? 9999 : 1 }}>
      {!!label && <Text style={styles.mainText}>{label}</Text>}
      {/** Compute defaults for multi-select badges */}
      {/** Prefer provided props if given */}
      {(() => null)()}
      <DropDownPicker
        listMode="SCROLLVIEW"
        dropDownDirection="BOTTOM"
        rtl={false}
        placeholder={dropdownPlaceholder}
        placeholderStyle={styles.placeholder}
        textStyle={styles.inputText}
        multiple={multiple}
        min={min}
        theme={theme.mode === "dark" ? "DARK" : "LIGHT"}
        open={isOpen}
        mode={mode || (multiple ? "BADGE" : "DEFAULT")}
        value={
          multiple
            ? (Array.isArray(value) ? value : [])
            : (value === undefined || value === "" ? null : value)
        }
        items={items}
        extendableBadgeContainer={extendableBadgeContainer ?? (!!multiple)}
        showBadgeDot={showBadgeDot ?? (!!multiple)}
        renderBadgeItem={renderBadgeItem}
        setOpen={handleSetOpen}
        setValue={handleSetValue}
        setItems={setItems}
        onChangeValue={handleChange}
        listItemLabelStyle={styles.pickerListItem}
        style={styles.pickerContainer}
        dropDownContainerStyle={styles.dropDownContainer}
        listMessageContainerStyle={styles.listMessageContainerStyle}
        listMessageTextStyle={styles.listMessageTextStyle}
        arrowIconContainerStyle={styles.arrowIconContainer}
        searchable={false}
        closeAfterSelecting={!multiple}
        disableLocalSearch={true}
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
  arrowIconContainer: {
    position: 'absolute',
    right: 10,
  },
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


