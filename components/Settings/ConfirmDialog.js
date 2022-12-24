import { Alert } from "react-native";

export const showConfirmDialog = (mainTitle, secondary, func) => {
  return Alert.alert(mainTitle, secondary, [
    {
      text: "Yes",
      onPress: func,
    },
    {
      text: "No",
    },
  ]);
};
