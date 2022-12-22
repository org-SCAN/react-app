import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import IconButton from "./components/BasicUI/IconButton";
import React from "react";

const Stack = createNativeStackNavigator();

const BasicScreenTheme = {
  headerStyle: { backgroundColor: "#BF0413" },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontSize: 20,
  },
};
const BasicNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
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

class App extends React.Component {
  render() {
    return (
      <NavigationContainer theme={BasicNavigationTheme}>
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
  }
}

export default App;
