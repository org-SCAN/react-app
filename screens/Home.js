import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";
import { connect } from "react-redux";
import { Icon } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { updateCaseNumber, deleteCase } from "../redux/actions";
import { deleteImageFromMemory, openZipAndExtractIcons, downloadZipFile } from "../utils/fileHandler";
import { deleteCameraCache } from "../utils/cacheManager";
import CustomAlertTwoButtons from "../components/Case/CustomAlertTwoButtons";
import * as FileSystem from "expo-file-system";
import { Asset } from 'expo-asset';


const Home = (props) => {
  const navigation = props.navigation;
  const [mOpacity, setOpacity] = useState(new Animated.Value(0));
  const { intlData } = props;

  const dispatch = useDispatch();
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);

  const [alertVisibleGoBack, setAlertVisibleGoBack] = useState(false); 
  const [crashImage, setCrashImage] = useState([]);
  

  const handleCreateCase = () => {
    dispatch(updateCaseNumber(caseNumber+1));
  };

  const handleDeleteImage = (item) => {
    dispatch(deleteCase(item.caseID));
    deleteImageFromMemory(item.id);
    //deleteCameraCache();
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
          title={intlData.messages.Home.caseButton}
          onPress={() => {
            //handleCreateCase();
            navigation.navigate("Case");
          }}
          description={"case"}
        />
        <ScanButton
          title={"test"}
          onPress={() => {
            (async () => {
              try {
                const zipUrl = "https://raw.githubusercontent.com/andeuxun/zipi/main/man.zip"; 

                await downloadZipFile(zipUrl);

                const zipPath = FileSystem.documentDirectory + "zip/icons.zip";
                const extractedIconsPath = await openZipAndExtractIcons(zipPath);

                console.log("Icons extracted to:", extractedIconsPath);
              } catch (error) {
                console.error("Failed to extract icons:", error);
              }
            })();
          }}
        />
        <ScanButton
          title={intlData.messages.Home.consultButton}
          onPress={() => {
            navigation.navigate("ShowCase");
          }}
          description={"showcase"}
        />
        <View style={styles.hintBox}>
          <View style={styles.hintLine}>
            <Icon name="description" size={22} color="grey" />
            <Text style={styles.hintText}> : {props.cases.length}</Text>
          </View>
          <View style={styles.hintLine}>
            <Icon name="camera-alt" size={22} color="grey" />
            <Text style={styles.hintText}> : {props.images.length}</Text>
          </View>
        </View>
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
});

function mapStateToProps(state) {
  return {
    cases: state.case.cases,
    images: state.image.image,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Home);
