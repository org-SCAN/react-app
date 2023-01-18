import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import { Camera } from "expo-camera";
import { storeImage } from "../redux/actions";
import IconButton from "../components/BasicUI/IconButton";
import { deleteCameraCache } from "../utils/cacheManager";
import uuid from "react-native-uuid";
import * as Location from "expo-location";

const ScanCamera = (props) => {
  const { navigation } = props;
  const caseID = props.route.params.caseID;
  const camType = Camera.Constants.Type;
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(camType.back);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const saveImage = (data) => {
    dispatch(storeImage(data));
  };

  useEffect(() => {}, []);

  const takePicture = async () => {
    setLoading(true);
    if (camera) {
      const data = await camera.takePictureAsync({ base64: true });
      if (data && data.base64) {
        const imageId = uuid.v4();
        //get permission status
        const { status } = await Location.requestForegroundPermissionsAsync();
        var location = { coords: { latitude: 0, longitude: 0 } };
        if (status !== "granted") {
          alert(
            "Permission to access location was denied, photo was saved without location data"
          );
        } else {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        }
        const image = {
          id: imageId,
          caseID: caseID,
          date: new Date().toISOString(),
          data: "data:image/jpg;base64," + data.base64,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        saveImage(image);
        deleteCameraCache();
      }
    }
  };
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        type={type}
        ratio={"1:1"}
        quality={0.25}
      />

      <View style={styles.control}>
        <IconButton
          name="camera"
          color="white"
          onPress={() =>
            takePicture().then(() => {
              navigation.goBack();
            })
          }
          size="40"
          style={styles.icon}
        />
        <IconButton
          name="autorenew"
          color="white"
          onPress={() => {
            setType(type === camType.back ? camType.front : camType.back);
          }}
          size="40"
          style={styles.icon}
        />
      </View>
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
  preview: {
    width: 75,
    height: 75,
    position: "absolute",
    bottom: 25,
    right: 25,
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
