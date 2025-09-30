import { View, Pressable } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

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

const IconButton = (props) => {
  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, props.style]}>
      <Pressable onPress={props.onPress} hitSlop={8} style={{ justifyContent: "center", alignItems: "center" }}>
        {(() => {
          const Pack = getIconPack(props.type);
          return (
            <Pack
              name={props.name}
              size={props.size || 30}
              color={props.color ?? "#fff"}
              style={{
                shadowColor: "black",
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity: 0.4,
              }}
            />
          );
        })()}
      </Pressable>
    </View>
  );
};

export default IconButton;
