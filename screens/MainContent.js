import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import Settings from "./Settings";
import ScanCamera from "./Camera";
import ShowCase from "./ShowCase";
import Pictures from "./Pictures";
import LocationUpdater from "../utils/locationUpdater";
import Case from "./Case";
import React from "react";
import { connect } from "react-redux";
import { navigationStyle } from "../theme/navTheme";
import { navigationRef } from "../RootNavigation";

const Stack = createNativeStackNavigator();

const MainContent = (props) => {
  const styles =
    props.theme.mode == "light" ? navigationStyle.light : navigationStyle.dark;
  const { intlData } = props;
  return (
    <NavigationContainer theme={styles.navigation} ref={navigationRef}>
      <LocationUpdater />
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={styles.home(props)}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: intlData.messages.Settings.title,
            ...styles.screen,
          }}
        />
        <Stack.Screen
          name="Camera"
          component={ScanCamera}
          options={styles.camera}
        />
        <Stack.Screen
          name="ShowCase"
          component={ShowCase}
          options={{
            title: intlData.messages.Case.title,
            ...styles.showCase,
          }}
        />
        <Stack.Screen
          name="Pictures"
          component={Pictures}
          options={{
            title: intlData.messages.Pictures.title,
            ...styles.screen,
          }}
        />
        <Stack.Screen
          name="Case"
          component={Case}
          options={{ title: intlData.messages.Case.title, ...styles.case }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(MainContent);
