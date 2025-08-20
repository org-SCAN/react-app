import { connect } from "react-redux";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { THEME_COLOR } from "../../theme/constants";

const CasePicker = (props) => {
  const { intlData, theme, style, types, selectedTypes, setSelectedTypes } = props;
  const styles = theme.mode === "dark" ? stylesDark : stylesLight;
  
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(types);
  
  console.log(items);

  const handleChange = (values) => {
    setSelectedTypes(values);
    setOpen(false);
    console.log(values);
  };

  return (
    <View>
      <Text style={style.placeholder}>{intlData.messages.Case.typeTitle}</Text>
      <DropDownPicker
        listMode="SCROLLVIEW"
        placeholder={intlData.messages.Case.typePlaceholder}
        placeholderStyle={styles.placeholder}
        multiple={true}
        min={0}
        theme={theme.mode === "dark" ? "DARK" : "LIGHT"}
        open={open}
        mode="BADGE"
        value={selectedTypes}
        items={items}
        extendableBadgeContainer={true} 
        showBadgeDot={true} 
        setOpen={setOpen}
        setValue={setSelectedTypes}
        setItems={setItems}
        onChangeValue={handleChange}
        listItemLabelStyle={styles.pickerListItem}
        style={styles.pickerContainer}
        dropDownContainerStyle={styles.dropDownContainer}
        listMessageContainerStyle={styles.listMessageContainerStyle}
        listMessageTextStyle={styles.listMessageTextStyle}
        ListEmptyComponent={({
            listMessageContainerStyle, listMessageTextStyle
          }) => (
            <View style={listMessageContainerStyle}>
                <Text style={listMessageTextStyle}>
                  {intlData.messages.Case.typeNone}
                </Text>
            </View>
        )}
        renderBadgeItem={(item) => (
          <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: THEME_COLOR.SCAN, marginRight: 5 }} />
            <Text style={styles.pickerItem}>{item.label}</Text>
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
  },
  mainText: {
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 15,
  },
  listMessageContainerStyle: {
    padding: 20,
  },
  listMessageTextStyle: {
    textAlign: "center",
  },
  pickerListItem: {
    //fontWeight: "600",
  },
  pickerItem: {
    fontWeight: "bold",
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
  pickerItem: {
    ...baseStyles.pickerItem,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
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
  pickerItem: {
    ...baseStyles.pickerItem,
    color: THEME_COLOR.DARK.INPUT_TEXT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
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
    types: state.typeAvailable.types,
  };
}

export default connect(mapStateToProps)(CasePicker);
