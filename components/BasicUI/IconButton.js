import { Icon } from "@rneui/themed";
import { TouchableOpacity } from "react-native";

const IconButton = (props) => {
  return (
    <TouchableOpacity
      style={props.style ? props.style : {}}
      onPress={props.onPress}
    >
      <Icon
        name={props.name}
        size={props.size || 30}
        color={props.color ?? "#fff"}
      />
    </TouchableOpacity>
  );
};

export default IconButton;
