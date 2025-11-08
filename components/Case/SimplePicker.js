import { connect } from "react-redux";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { THEME_COLOR } from "../../theme/constants";

const SimplePicker = ({
  theme,
  label,
  items = [],
  value,
  setValue,
  placeholder = "",
  dropdownPlaceholder,
  emptyText = "Aucune option disponible",
  isOpen = false,
  setOpen,
  onOpen,
  onClose,
  style,
  clearOnSelectSame = true,
}) => {
  const styles = theme.mode === "dark" ? stylesDark : stylesLight;

  const [pickerItems, setPickerItems] = useState(items);
  useEffect(() => setPickerItems(items), [items]);

  // Utiliser un ref pour avoir toujours la valeur actuelle
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const safeSetValue = useCallback(
    (updater) => {
      if (!setValue) return;
      try {
        const currentValue = valueRef.current;
        const next = typeof updater === "function" ? updater(currentValue) : updater;
        const sanitized = next === "" ? null : next ?? null;
        setValue(sanitized);
      } catch (_) {
        // fallback: ignore
      }
    },
    [setValue]
  );

  const handleSetOpen = (open) => {
    if (open === isOpen) return;
    if (typeof setOpen === "function") setOpen(open);
    if (open) {
      if (onOpen) onOpen();
    } else {
      if (onClose) onClose();
    }
  };

  const handleSelectItem = (item) => {
    // Si clearOnSelectSame est activé et qu'on reclique sur la même valeur
    if (clearOnSelectSame && item.value === value) {
      setValue(null);
      if (typeof setOpen === "function") setOpen(false);
    } else {
      setValue(item.value);
      if (typeof setOpen === "function") setOpen(false);
    }
  };

  // Vérifier que la valeur correspond à un item existant
  useEffect(() => {
    if (value !== null && value !== undefined && pickerItems.length > 0) {
      const foundItem = pickerItems.find(item => item.value === value);
      if (!foundItem) {
        console.warn(`SimplePicker: Value "${value}" not found in items`);
      }
    }
  }, [value, pickerItems]);

  return (
    <View style={[{ zIndex: isOpen ? 9999 : 1 }, style]}>
      {!!label && <Text style={styles.mainText}>{label}</Text>}

      <DropDownPicker
        listMode="SCROLLVIEW"
        dropDownDirection="BOTTOM"
        placeholder={dropdownPlaceholder || placeholder}
        placeholderStyle={styles.placeholder}
        textStyle={styles.inputText}
        multiple={false}
        theme={theme.mode === "dark" ? "DARK" : "LIGHT"}
        open={isOpen}
        setOpen={handleSetOpen}
        value={value === "" || value === undefined ? null : value}
        setValue={safeSetValue}
        items={pickerItems}
        setItems={setPickerItems}
        onSelectItem={handleSelectItem}
        closeAfterSelecting={false}
        listItemLabelStyle={styles.pickerListItem}
        style={styles.pickerContainer}
        dropDownContainerStyle={styles.dropDownContainer}
        listMessageContainerStyle={styles.listMessageContainerStyle}
        listMessageTextStyle={styles.listMessageTextStyle}
        arrowIconContainerStyle={styles.arrowIconContainer}
        searchable={false}
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

/* === Styles identiques à BasePicker === */
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
    position: "absolute",
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

function mapStateToProps(state) {
  return {
    theme: state.theme,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(SimplePicker);