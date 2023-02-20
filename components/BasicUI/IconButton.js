import { Icon } from "@rneui/themed";
import { Pressable } from "react-native";

const IconButton = (props) => {
  return (
    <Pressable style={props.style ? props.style : {}} onPress={props.onPress}>
      <Icon
        name={props.name}
        size={props.size || 30}
        color={props.color ?? "#fff"}
        style={{
          shadowColor: "black",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.4,
        }}
      />
    </Pressable>
  );
};

export default IconButton;
