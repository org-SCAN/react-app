import { DefaultTheme } from "@react-navigation/native";
import IconButton from "../components/BasicUI/IconButton";
import { SCAN_COLOR } from "./constants";

const Screen = {
  headerStyle: { backgroundColor: SCAN_COLOR },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontSize: 20,
  },
};
const BasicNavigationThemeLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
  },
};

const BasicNavigationThemeDark = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#1C1C1EFF",
  },
};

const HomeTheme = ({ navigation }) => ({
  ...Screen,
  headerRight: () => (
    <IconButton
      name="settings"
      onPress={() => navigation.navigate("Settings")}
    />
  ),
});

export const navigationStyle = {
  light: {
    screen: Screen,
    navigation: BasicNavigationThemeLight,
    home: HomeTheme,
  },
  dark: {
    screen: Screen,
    navigation: BasicNavigationThemeDark,
    home: HomeTheme,
  },
};
