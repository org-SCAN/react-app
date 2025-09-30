import { Text, Pressable } from "react-native";
import { connect } from "react-redux";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME_COLOR } from "../../theme/constants";


const ScanButton = (props) => {
  const { size, name, theme, subtitle, onPressIn, styleIcon, onPress, type, styleText, styleButton } = props;
  const getIconPack = (type) => {
    switch (type) {
      case "material-community":
        return MaterialCommunityIcons;
      case "material-icons-outlined":
      case "material-icons":
      default:
        return MaterialIcons;
    }
  };

  return (
    <Pressable
      style={[{ justifyContent: "center", alignItems: "center" }, styleButton]}
      onPressIn={onPressIn}
      onPress={onPress}
    >
      {(() => {
        const Pack = getIconPack(type);
        return (
          <Pack
            name={name}
            size={size ? size : styleIcon.size}
            color={theme.mode === "light" ? THEME_COLOR.LIGHT.BUTTON_TEXT : THEME_COLOR.DARK.BUTTON_TEXT}
            style={styleIcon}
          />
        );
      })()}
      {subtitle && <Text style={styleText}>{subtitle}</Text>}
    </Pressable>
  );
};

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(ScanButton);
