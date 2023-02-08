import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";

const Home = (props) => {
  const navigation = props.navigation;
  const [mOpacity, setOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (props.route.params && props.route.params.notification) {
      setOpacity(new Animated.Value(1));
    }
  }, [props.route.params]);

  useEffect(() => {
    //fade out if opacity is 1
    if (mOpacity._value === 1) {
      setTimeout(() => {
        Animated.timing(mOpacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      }, 500);
    }
  }, [mOpacity]);

  return (
    <View style={styles.mainContent}>
      <Animated.View
        style={{ ...styles.notification, ...{ opacity: mOpacity } }}
      >
        <Text>Case Saved ✅</Text>
      </Animated.View>
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
