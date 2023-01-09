import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Settings from "./Settings";
import ScanCamera from "./Camera";
import ShowCase from "./ShowCase";
import Case from "./Case";
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
        <Stack.Screen
          name="Camera"
          component={ScanCamera}
          options={styles.camera}
        />
        <Stack.Screen
          name="ShowCase"
          component={ShowCase}
          options={styles.screen}
        />
        <Stack.Screen name="Case" component={Case} options={styles.case} />
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
