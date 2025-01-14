import { Icon } from "@rneui/themed";
import { View } from "react-native";

const IconButton = (props) => {
  return (
    <View style={props.style}>
      <Icon
        name={props.name}
        size={props.size || 30}
        color={props.color ?? "#fff"}
        onPress={props.onPress}
        
        style={{
          shadowColor: "black",
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.4,
        }}
      />
    </View>
  );
};

export default IconButton;
