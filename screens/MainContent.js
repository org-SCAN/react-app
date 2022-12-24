import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Settings from "./Settings";
import IconButton from "../components/BasicUI/IconButton";
import React from "react";
import { connect } from "react-redux";

const Stack = createNativeStackNavigator();

const BasicScreenTheme = {
  headerStyle: { backgroundColor: "#BF0413" },
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
  ...BasicScreenTheme,
  headerRight: () => (
    <IconButton
      name="settings"
      onPress={() => navigation.navigate("Settings")}
    />
  ),
});

const MainContent = (props) => {
  return (
    <NavigationContainer
      theme={
        props.theme.mode == "light"
          ? BasicNavigationThemeLight
          : BasicNavigationThemeDark
      }
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={HomeTheme} />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={BasicScreenTheme}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(MainContent);
