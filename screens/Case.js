import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import ScanInput from "../components/BasicUI/ScanInput";
import ScanButton from "../components/BasicUI/ScanButton";
import uuid from "react-native-uuid";
import { useDispatch, connect } from "react-redux";
import { saveCase } from "../redux/actions";

const FORM = [
  {
    key: "forname",
    placeholder: "Forename",
    value: "",
    onChangeText: null,
    keyboardType: "default",
  },
  {
    key: "lastname",
    placeholder: "Lastname",
    value: "",
    onChangeText: null,
    keyboardType: "default",
  },
  {
    key: "age",
    placeholder: "Age",
    value: "",
    onChangeText: null,
    keyboardType: "numeric",
  },
];

const Case = (props) => {
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const save = () => {
    setLoading(true);
    const keyValues = FORM.map((element) => {
      return { [element.key]: element.value };
    });
    const keyValuesObject = Object.assign({}, ...keyValues);
    //get all images id
    const imageIDs = images.map((image) => image.id);
    const data = {
      id: caseID,
      ...keyValuesObject,
      images: imageIDs,
      date: new Date().toISOString(),
    };
    dispatch(saveCase(data));
    navigation.navigate("Home");
  };

  useEffect(() => {
    setCaseID(uuid.v4());

    return () => {
      //clear form
      FORM.forEach((element) => {
        element.value = "";
        element.onChangeText("");
      });
    };
  }, []);

  useEffect(() => {
    if (props.images && props.images.length > 0) {
      const DATA = props.images
        .map((image) => {
          return {
            id: image.id,
            uri: image.data,
            caseID: image.caseID,
          };
        })
        .filter((image) => image.caseID === caseID);
      setImages(DATA);
    }
  }, [props.images]);

  FORM.forEach((element) => {
    const [value, onChangeText] = useState(element.value);
    element.value = value;
    element.onChangeText = onChangeText;
  });
  const renderItem = ({ item }) => (
    <ScanInput
      placeholder={item.placeholder}
      value={item.value}
      onChangeText={item.onChangeText}
      keyboardType={item.keyboardType}
    />
  );
  const renderImage = ({ item }) => (
    <Image
      source={{ uri: item.uri }}
      style={{ width: 150, height: 150, margin: 10 }}
    />
  );

  return (
    <SafeAreaView style={styles.mainContent}>
      {loading && (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <FlatList
        data={FORM}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={<View style={{ height: 20 }} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
        style={{ flexGrow: 0 }}
      />
      <ScanButton
        title="Take a photo"
        onPress={() => navigation.navigate("Camera", { caseID: caseID })}
      />
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        ListFooterComponent={<View style={{ height: 50 }} />}
        style={{ flexGrow: 0 }}
        horizontal={true}
      />
      <View style={styles.button}>
        <ScanButton
          title="Submit"
          onPress={() => {
            save();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    position: "absolute",
    bottom: 0,
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
    images: state.image.image,
  };
}

export default connect(mapStateToProps)(Case);
