import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator, Text, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CameraView, useCameraPermissions } from "expo-camera";
import { storeImage, updateLocation } from "../redux/actions";
import { connect } from "react-redux";
import IconButton from "../components/BasicUI/IconButton";
import uuid from "react-native-uuid";
import * as Location from "expo-location";
import CustomAlert from "../components/Alert/CustomAlert";
import { deleteCameraCache } from "../utils/cacheManager";
import { saveImageToMemory } from "../utils/fileHandler";

const ScanCamera = (props) => {
  const { navigation } = props;
  const { intlData } = props;
  const caseID = props.route.params.caseID;

  const [camera, setCamera] = useState(null);
  const [facing, setFacing] = useState("back");
  const [loading, setLoading] = useState(false);  

  const coords = useSelector(state => state.location.coords);
   
  const dispatch = useDispatch();

  const saveImage = (data) => {
    dispatch(storeImage(data));
  };

  const takePicture = async () => {
    setLoading(true);
    try {
      if (camera) {
        const data = await camera.takePictureAsync({
          quality: 0.40,
          base64: true,
        });
        if (data && data.base64) {
          const imageId = uuid.v4();
          let location = { coords: coords };
          if ((location.coords.latitude === 0 && location.coords.longitude === 0)) {
            alert(
              intlData.messages.Camera.noLocationFound
            );
          }
          // Save image to file system
          const path = await saveImageToMemory(data.base64, imageId);
          const image = {
            id: imageId,
            caseID: caseID,
            date: new Date().toISOString(),
            data: path,
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          };
          saveImage(image);
          deleteCameraCache();
        }
      }
      else {
        alert("Camera not ready, please try again.");
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prevFacing) => (prevFacing === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <CameraView 
        style={styles.camera} 
        facing={facing} 
        ref={(ref) => setCamera(ref)}
        ratio={"1:1"}
        quality={0.25}
      >
        <View style={styles.control}>
          <IconButton
            name="camera"
            color="white"
            onPress={() => {
              takePicture().then(() => {
                navigation.goBack();
              });
            }}
            size={40}
            style={styles.icon}
          />
          <IconButton
            name="autorenew"
            color="white"
            onPress={toggleCameraFacing}
            size={40}
            style={styles.icon}
          />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  control: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  icon: {
    marginHorizontal: 30,
    marginVertical: 50,
    alignSelf: 'flex-end',
  },
  activityContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
});

function mapStateToProps(state) {
  return {
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(ScanCamera);