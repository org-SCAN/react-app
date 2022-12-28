import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { useDispatch } from "react-redux";
import { Camera } from "expo-camera";
import { storeImage } from "../redux/actions";
import IconButton from "../components/BasicUI/IconButton";
import { deleteCameraCache } from "../utils/cacheManager";

const ScanCamera = () => {
  const camType = Camera.Constants.Type;
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(camType.back);
  const dispatch = useDispatch();
  const saveImage = (data) => {
    dispatch(storeImage(data));
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({ base64: true });
      if (data && data.base64) {
        setImage("data:image/jpg;base64," + data.base64);
        saveImage("data:image/jpg;base64," + data.base64);
        deleteCameraCache();
      }
    }
  };
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.camera}
          type={type}
          ratio={"1:1"}
        />
      </View>

      <IconButton name="camera" color="black" onPress={() => takePicture()} />
      <Button
        title="Flip Image"
        onPress={() => {
          setType(type === camType.back ? camType.front : camType.back);
        }}
      ></Button>
      {image && <Image source={{ uri: image }} style={styles.preview} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  preview: {
    width: 100,
    height: 100,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});

export default ScanCamera;
