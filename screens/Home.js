import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { deleteCase } from "../redux/actions";
import { deleteImageFromMemory } from "../utils/fileHandler";
import { THEME_COLOR } from "../theme/constants";
import CustomAlertTwoButtons from "../components/Alert/CustomAlertTwoButtons";

const Home = (props) => {
  const navigation = props.navigation;
  const [mOpacity, setOpacity] = useState(new Animated.Value(0));
  const { intlData } = props;

  const styles = props.theme.mode === "light" ? stylesLight : stylesDark;

  const dispatch = useDispatch();

  const [alertVisibleGoBack, setAlertVisibleGoBack] = useState(false); 
  const [crashImage, setCrashImage] = useState([]);
  
  const handleDeleteImage = (item) => {
    dispatch(deleteCase(item.caseID));
    deleteImageFromMemory(item.id);
  };

  useEffect(() => {
    if (props.route.params && props.route.params.notification) {
      setOpacity(new Animated.Value(1));
    }
  }, [props.route.params]);

  useEffect(() => {
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

  useEffect(() => {
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2]; // -2 because -1 is the current route
  
    // only check if the previous route is undefined (crash)
    if (!prevRoute) {
      const crashImage = props.images.filter(
        (image) => !props.cases.some((caseItem) => caseItem.id === image.caseID)
      );
  
      if (crashImage.length > 0) {
        console.log("Crash Case: ", crashImage);
        setCrashImage(crashImage);
        setAlertVisibleGoBack(true);
      }
    }
  }, [navigation, props.cases, props.images]);
  

  return (
    <View style={styles.mainContent}>
      <Animated.View
        style={{ ...styles.notification, ...{ opacity: mOpacity } }}
      >
        <Text>✅</Text>
      </Animated.View>

      <CustomAlertTwoButtons
        title="⚠️"
        message={intlData.messages.Home.recoverCase}
        onConfirm={() => {
          navigation.navigate("Case", { images: crashImage });
          setCrashImage([]);
          setAlertVisibleGoBack(false);
        }}
        onCancel={() => {
          crashImage.forEach((image) => handleDeleteImage(image));
          console.log("Crash Images deleted");
          setCrashImage([]);
          setAlertVisibleGoBack(false);
        }}
        visible={alertVisibleGoBack}
        confirmButtonText={intlData.messages.yes}
        cancelButtonText={intlData.messages.no}
      />

      <View style={styles.menu}>
        <ScanButton
          subtitle={intlData.messages.Home.caseButton}
          onPressIn={() => {
            navigation.navigate("Case");
          }}
          size={45}
          name="create-new-folder"
          type="material-icons"
          styleIcon={styles.icon}
          styleText={styles.text}
          styleButton={styles.button}
        />
        <ScanButton
          subtitle={intlData.messages.Home.consultButton}
          onPressIn={() => {
            navigation.navigate("ShowCase");
          }}
          size={45}
          name="folder-search"
          type="material-community"
          styleIcon={styles.icon}
          styleText={styles.text}
          styleButton={styles.button}
        />
          <View style={styles.hintBox}>
          <View style={styles.hintLine}>
            <MaterialIcons name="description" size={22} color="grey" />
            <Text style={styles.hintText}> : {props.cases.length}</Text>
          </View>
          <View style={styles.hintLine}>
            <MaterialIcons name="camera-alt" size={22} color="grey" />
            <Text style={styles.hintText}> : {props.images.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const basicStyles = StyleSheet.create({
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
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#6FDE7A30",
    borderColor: "#6FDE7A30",
  },
  hintBox: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    width: 200,
  },
  hintLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  hintText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "grey",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
    width: 200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    textAlign: "center",
  },
});

const stylesLight = StyleSheet.create({
  ...basicStyles,
  button: {
    ...basicStyles.button,
    backgroundColor: THEME_COLOR.LIGHT.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.BUTTON_BORDER,
    shadowColor: THEME_COLOR.LIGHT.BUTTON_SHADOW,
  },
  text: {
    ...basicStyles.text,
    color: THEME_COLOR.LIGHT.BUTTON_TEXT,
  },
});

const stylesDark = StyleSheet.create({
  ...basicStyles,
  button: {
    ...basicStyles.button,
    backgroundColor: THEME_COLOR.DARK.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.BUTTON_BORDER,
    shadowColor: THEME_COLOR.DARK.BUTTON_SHADOW,
  },
  text: {
    ...basicStyles.text,
    color: THEME_COLOR.DARK.BUTTON_TEXT,
  },
});

function mapStateToProps(state) {
  return {
    cases: state.case.cases,
    images: state.image.image,
    theme: state.theme,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Home);
