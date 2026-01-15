import React, { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import * as LocalAuthentication from "expo-local-authentication";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import MainContent from "./screens/MainContent";
import { PersistGate } from "redux-persist/lib/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
  Button,
  Image,
} from "react-native";

const App = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const requestPermissions = async () => {
    await Camera.requestCameraPermissionsAsync().then((res) => {
      setCameraPermission(res.status === "granted");
    });
    await Location.requestForegroundPermissionsAsync().then((res) => {
      setLocationPermission(res.status === "granted");
    });
  };

  const runLocalAuth = async () => {
    setIsCheckingAuth(true);
    setAuthError(null);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        // Si l'appareil n'a pas de biométrie / code configuré,
        // on laisse passer l'utilisateur (tu peux changer ce comportement).
        setIsAuthenticated(true);
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Déverrouiller pour ouvrir l’application",
        cancelLabel: "Annuler",
        fallbackLabel: "Utiliser le code de l’appareil",
      });

      if (result.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError("Authentification annulée ou échouée.");
      }
    } catch (e) {
      setAuthError("Erreur lors de l’authentification.");
    } finally {
      setIsCheckingAuth(false);
    }
  };

  useEffect(() => {
    (async () => {
      await requestPermissions();
      await runLocalAuth();
    })();
  }, []);

  if (cameraPermission === false) {
    var errorText =
      "This application need Camera access. Please allow it in your phone settings.";

    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorText}</Text>
      </SafeAreaView>
    );
  }

  if (isCheckingAuth) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("./assets/logo_divi_splash.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Divi</Text>
        </View>
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loaderText}>
            Vérification de votre identité…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        {authError && <Text style={styles.errorText}>{authError}</Text>}
        <Text style={styles.errorText}>
          Authentification requise pour accéder à l’application.
        </Text>
        <View style={{ marginTop: 20 }}>
          <Button title="Réessayer" onPress={runLocalAuth} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            <MainContent />
          </PaperProvider>
        </GestureHandlerRootView>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logo: {
    width: 320,
    height: 320,
    marginBottom: 8,
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    marginTop: 0,
    letterSpacing: 1,
  },
  loadingSection: {
    alignItems: "center",
    marginTop: 20,
  },
  loaderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
});

export default App;
