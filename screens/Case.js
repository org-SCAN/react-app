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
import { saveCase, editCase } from "../redux/actions";

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
  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  FORM.forEach((element) => {
    const [value, onChangeText] = useState(element.value);
    element.value = value;
    element.onChangeText = onChangeText;
  });

  const dispatch = useDispatch();

  const save = () => {
    setLoading(true);
    const keyValues = FORM.map((element) => {
      return { [element.key]: element.value };
    });
    const keyValuesObject = Object.assign({}, ...keyValues);
    const imageIDs = images.map((image) => image.id);
    const data = {
      id: caseID,
      ...keyValuesObject,
      images: imageIDs,
      date: new Date().toISOString(),
    };
    if (existingCase) {
      dispatch(editCase(data));
      navigation.navigate("ShowCase");
    } else {
      dispatch(saveCase(data));
      navigation.navigate("Home");
    }
  };

  const setCaseImages = () => {
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
    } else {
      setImages([]);
    }
  };

  useEffect(() => {
    if (props.route.params && props.route.params.caseId) {
      const mcase = props.cases.filter(
        (item) => item.id === props.route.params.caseId
      )[0];
      setExistingCase(mcase);
      setCaseID(mcase.id);
    } else {
      setCaseID(uuid.v4());
    }

    return () => {
      //clear form
      FORM.forEach((element) => {
        element.value = "";
        element.onChangeText("");
      });
    };
  }, []);

  useEffect(() => {
    //update form with existing case if it exist
    if (existingCase) {
      FORM.forEach((element) => {
        element.onChangeText(existingCase[element.key]);
      });
    }
    setCaseImages();
  }, [existingCase]);

  useEffect(() => {
    setCaseImages();
  }, [props.images]);

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
    cases: state.case.cases,
  };
}

export default connect(mapStateToProps)(Case);
