import { Alert } from "react-native";

export const showConfirmDialog = (mainTitle, secondary, func, yesText = "Yes", noText = "No") => {
  return Alert.alert(mainTitle, secondary, [
    {
      text: yesText, // Texte du bouton "Yes" passé en argument
      onPress: func,
    },
    {
      text: noText, // Texte du bouton "No" passé en argument
    },
  ]);
};
