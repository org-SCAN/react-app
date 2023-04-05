import { DefaultTheme } from "@react-navigation/native";
import IconButton from "../components/BasicUI/IconButton";
import { SCAN_COLOR } from "./constants";
import * as RootNavigation from "../RootNavigation";

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

const HomeTheme = (props) => {
  const { intlData } = props;
  return {
    ...Screen,
    title: intlData.messages.Home.title,
    headerRight: () => (
      <IconButton
        name="settings"
        onPress={() => RootNavigation.navigate("Settings", {})}
      />
    ),
  };
};

const CameraTheme = {
  ...Screen,
  headerShown: false,
  headerStyle: { backgroundColor: "black" },
};

const ShowCaseTheme = {
  ...Screen,
};

export const navigationStyle = {
  light: {
    screen: Screen,
    navigation: BasicNavigationThemeLight,
    home: HomeTheme,
    camera: CameraTheme,
    case: Screen,
    showCase: ShowCaseTheme,
  },
  dark: {
    screen: Screen,
    navigation: BasicNavigationThemeDark,
    home: HomeTheme,
    camera: CameraTheme,
    case: Screen,
    showCase: ShowCaseTheme,
  },
};
