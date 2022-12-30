import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import MainContent from "./screens/MainContent";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Text, StyleSheet, SafeAreaView } from "react-native";

const App = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    (async () => {
      await Camera.requestCameraPermissionsAsync().then((res) => {
        setCameraPermission(res.status === "granted");
      });
      await Location.requestForegroundPermissionsAsync().then((res) => {
        setLocationPermission(res.status === "granted");
      });
    })();
  }, []);

  if (cameraPermission === false || locationPermission === false) {
    var errorText = "";
    if (cameraPermission === false && locationPermission === false) {
      errorText =
        "This application need Camera and Location access. Please allow it in your phone settings.";
    } else if (cameraPermission === false) {
      errorText =
        "This application need Camera access. Please allow it in your phone settings.";
    } else if (locationPermission === false) {
      errorText =
        "This application need Location access. Please allow it in your phone settings.";
    }

    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorText}</Text>
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainContent />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default App;
