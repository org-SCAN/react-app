import { connect, useDispatch } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { updateLanguage } from "../../redux/actions";

const languagePicker = (props) => {
  const dispatch = useDispatch();

  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;

  console.log("LanguagePicker: ", props);
  const { intlData } = props;
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

  return (
    <View>
      <Text style={styles.mainText}>{intlData.messages.Settings["selectLanguage"]}</Text>
      <Picker
        selectedValue={intlData.locale}
        onValueChange={(itemValue) => dispatch(updateLanguage(itemValue))}
        style={styles.pickerContainer}
        dropdownIconColor={styles.dropdownIconColor}
      >
        {options}
      </Picker>
    </View>
  );
};


const baseStyles = {
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
};

const stylesLight = StyleSheet.create({
  mainText: {
    color: "black",
  },
  pickerItem: {
    color: "black",
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
    borderColor: "black",
  },
  dropdownIconColor: "black",
});

const stylesDark = StyleSheet.create({
  mainText: {
    color: "white",
  },
  pickerItem: {
    color: "black",
  },
  pickerContainer: {
    ...baseStyles.pickerContainer,
    borderColor: "white",
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
