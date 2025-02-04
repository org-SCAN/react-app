import { Text, Pressable } from "react-native";
import { connect } from "react-redux";
import { Icon } from "@rneui/themed";
import { THEME_COLOR } from "../../theme/constants";


const ScanButton = (props) => {
  const { size, name, theme, subtitle, onPressIn, styleIcon, onPress, type, styleText, styleButton } = props;
  return (
    <Pressable style={styleButton} onPressIn={onPressIn} onPress={onPress}>
      <Icon 
       name={name} 
       size={size ? size : styleIcon.size}
       color={theme.mode === "light" ? THEME_COLOR.LIGHT.BUTTON_TEXT : THEME_COLOR.DARK.BUTTON_TEXT} 
       type={type} 
      />
      {subtitle && <Text style={styleText}>{subtitle}</Text>}
    </Pressable>
  );
};

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(ScanButton);
