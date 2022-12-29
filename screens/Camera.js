import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { Camera } from "expo-camera";
import { storeImage } from "../redux/actions";
import IconButton from "../components/BasicUI/IconButton";
import { deleteCameraCache } from "../utils/cacheManager";

const ScanCamera = ({ navigation: { navigate } }) => {
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
      <Camera
        ref={(ref) => setCamera(ref)}
        style={styles.camera}
        type={type}
        ratio={"1:1"}
      />

      <View style={styles.control}>
        <IconButton
          name="camera"
          color="white"
          onPress={() => takePicture()}
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
      {image && (
        <TouchableOpacity
          onPress={() => {
            navigate("Pictures");
          }}
        >
          <Image source={{ uri: image }} style={styles.preview} />
        </TouchableOpacity>
      )}
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
});

export default ScanCamera;
