import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Settings from "./screens/Settings";

const Stack = createNativeStackNavigator();
const ScanTheme = {
  headerStyle: { backgroundColor: "#BF0413" },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontFamily: "Cochin",
    fontWeight: "bold",
    fontSize: 20,
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={ScanTheme} />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={ScanTheme}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
