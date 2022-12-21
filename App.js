import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";

const Stack = createNativeStackNavigator();
const ScanTheme = {
  title: "SCAN",
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
