import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Settings from "./Settings";
import React from "react";
import { connect } from "react-redux";
import { navigationStyle } from "../theme/theme";

const Stack = createNativeStackNavigator();

const MainContent = (props) => {
  const styles =
    props.theme.mode == "light" ? navigationStyle.light : navigationStyle.dark;
  return (
    <NavigationContainer theme={styles.navigation}>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={styles.home} />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={styles.screen}
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
