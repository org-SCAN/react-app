import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import ScanInput from "../components/BasicUI/ScanInput";
import ScanButton from "../components/BasicUI/ScanButton";
import uuid from "react-native-uuid";
import { useDispatch, connect } from "react-redux";
import { saveCase, editCase } from "../redux/actions";
import { HeaderBackButton } from "react-navigation-stack";
import { Alert } from "react-native";

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
  {
    key: "injuries",
    placeholder: "Cause of injuries",
    value: "",
    onChangeText: null,
    keyboardType: "default",
  },
];

const Case = (props) => {
  const styles = props.theme.mode === "light" ? lightStyle : darkStyle;
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  //Change the back button onpress beahviour and disable swipe back
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            var isFormFilled = false;
            if (images.length === 0) {
              isFormFilled = true;
            }
            const keyValues = FORM.map((element) => {
              return { [element.key]: element.value };
            });
            const emptyValues = keyValues.filter((element) => {
              return element[Object.keys(element)[0]] === "";
            });
            if (emptyValues.length > 0) {
              isFormFilled = true;
            }
            if (isFormFilled) {
              Alert.alert("Are you sure you want to discard this case ?", "", [
                {
                  text: "Yes",
                  onPress: () => navigation.goBack(),
                },
                {
                  text: "No",
                },
              ]);
            } else {
              navigation.goBack();
            }
          }}
        />
      ),
      gestureEnabled: false,
    });
  }, [navigation, FORM, images]);

  FORM.forEach((element) => {
    const [value, onChangeText] = useState(element.value);
    element.value = value;
    element.onChangeText = onChangeText;
  });

  const dispatch = useDispatch();

  const save = () => {
    if (images.length === 0) {
      alert("Please add at least one image");
      return;
    }
    const keyValues = FORM.map((element) => {
      return { [element.key]: element.value };
    });
    //if a value is empty send an alert
    const emptyValues = keyValues.filter((element) => {
      return element[Object.keys(element)[0]] === "";
    });
    if (emptyValues.length > 0) {
      alert("Please fill all the fields");
      return;
    }
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
    <TouchableOpacity
      onPress={() => navigation.navigate("Pictures", { caseID: item.caseID })}
    >
      <Image
        source={{ uri: item.uri }}
        style={{ width: 150, height: 150, margin: 10 }}
        blurRadius={20}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContent}>
      {loading && (
        <View style={styles.activityContainer}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
      <FlatList
        data={FORM.filter((item) => item.key !== "injuries")}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={<View style={{ height: 20 }} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
        style={{ flexGrow: 0 }}
        scrollEnabled={false}
      />
      <TextInput
        editable
        multiline
        numberOfLines={3}
        placeholder={FORM[3].placeholder}
        value={FORM[3].value}
        onChangeText={FORM[3].onChangeText}
        keyboardType={FORM[3].keyboardType}
        style={styles.injuries}
        placeholderTextColor={
          props.theme.mode === "light" ? "#B3B3B3" : "#B3B3B39C"
        }
      />
      <ScanButton
        title="Take a photo"
        onPress={() => navigation.navigate("Camera", { caseID: caseID })}
      />
      <Text style={{ fontStyle: "italic" }}>
        Take at least 5 photos if possible
      </Text>
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
          title="Save"
          onPress={() => {
            save();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const basicStyle = StyleSheet.create({
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
  injuries: {
    height: 90,
    width: 300,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

const lightStyle = StyleSheet.create({
  ...basicStyle,
  injuries: {
    ...basicStyle.injuries,
    borderColor: "#000",
  },
});

const darkStyle = StyleSheet.create({
  ...basicStyle,
  injuries: {
    ...basicStyle.injuries,
    borderColor: "#fff",
    backgroundColor: "#333333",
  },
});

function mapStateToProps(state) {
  return {
    images: state.image.image,
    cases: state.case.cases,
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(Case);
