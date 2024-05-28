import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, ActivityIndicator, Text, Button, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { CameraView, useCameraPermissions } from "expo-camera";
import { storeImage } from "../redux/actions";
import IconButton from "../components/BasicUI/IconButton";
import uuid from "react-native-uuid";
import * as Location from "expo-location";
import { deleteCameraCache } from "../utils/cacheManager";
import { saveImageToMemory } from "../utils/fileHandler";

const ScanCamera = (props) => {
  const { navigation } = props;
  const caseID = props.route.params.caseID;
  const [facing, setFacing] = useState("back");
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const dispatch = useDispatch();

  const saveImage = (data) => {
    dispatch(storeImage(data));
  };

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const takePicture = async () => {
    setLoading(true);
    if (cameraRef.current) {
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.25,
        base64: true,
      });
      if (data && data.base64) {
        const imageId = uuid.v4();
        // Get permission status
        const { status } = await Location.requestForegroundPermissionsAsync();
        var location = { coords: { latitude: 0, longitude: 0 } };
        if (status !== "granted") {
          alert("Permission to access location was denied, photo was saved without location data");
        } else {
          // Get location in 5 seconds max
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeout: 5000,
          });
          if (!location) {
            alert("Could not get location, photo was saved without location data");
          }
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
    setLoading(false);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        ratio="1:1"
        quality={0.25}
      >
        <View style={styles.control}>
          <IconButton
            name="camera"
            color="white"
            onPress={() =>
              takePicture().then(() => {
                navigation.goBack();
              })
            }
            size={40}
            style={styles.icon}
          />
          <IconButton
            name="autorenew"
            color="white"
            onPress={() => {
              setFacing(facing === "back" ? "front" : "back");
            }}
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
    alignContent: "center",
    backgroundColor: "black",
  },
  camera: {
    aspectRatio: 1,
    flex: 2,
    marginBottom: 40,
  },
  control: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginHorizontal: 30,
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

export default ScanCamera;