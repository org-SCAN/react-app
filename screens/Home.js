import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";

const Home = (props) => {
  const navigation = props.navigation;
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (props.route.params && props.route.params.notification) {
      setNotification(true);
    }
  }, [props.route.params]);

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(false);
      }, 1000);
    }
  }, [notification]);

  return (
    <View style={styles.mainContent}>
      {notification && (
        <View style={styles.notification}>
          <Text>Case Saved ✅</Text>
        </View>
      )}
      <View style={styles.menu}>
        <ScanButton
          title="New case"
          onPress={() => {
            navigation.navigate("Case");
          }}
        />
        <ScanButton
          title="Consult cases"
          onPress={() => {
            navigation.navigate("ShowCase");
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notification: {
    position: "absolute",
    top: 100,
    borderWidth: 1,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#6FDE7A30",
    borderColor: "#6FDE7A30",
  },
});

export default Home;
