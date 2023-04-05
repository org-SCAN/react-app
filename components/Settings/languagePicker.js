import { connect, useDispatch } from "react-redux";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { updateLanguage } from "../../redux/actions";

const languagePicker = (props) => {
  const dispatch = useDispatch();
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
      />
    );
  });

  return (
    <View>
      <Text>{intlData.messages.Settings["selectLanguage"]}</Text>
      <Picker
        selectedValue={intlData.locale}
        onValueChange={(itemValue) => dispatch(updateLanguage(itemValue))}
      >
        {options}
      </Picker>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(languagePicker);
