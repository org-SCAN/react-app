import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Vibration,
  Pressable,
} from "react-native";
import ScanInput from "../components/BasicUI/ScanInput";
import ScanButton from "../components/BasicUI/ScanButton";
import LittleScanButton from "../components/BasicUI/LittleScanButton";
import uuid from "react-native-uuid";
import { useDispatch, connect } from "react-redux";
import { saveCase, editCase, deleteCase } from "../redux/actions";
import { HeaderBackButton } from "react-navigation-stack";
import { Alert, ScrollView } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { deleteCameraCache } from "../utils/cacheManager";
import { createZip } from "../utils/fileHandler";
import { deleteImageFromMemory, deleteZip } from "../utils/fileHandler";

const Case = (props) => {
  const styles = props.theme.mode === "light" ? lightStyle : darkStyle;
  const { intlData } = props;
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedIconAge, setSelectedIconAge] = useState(null);
  const [selectedIconSex, setSelectedIconSex] = useState(null);

  const dispatch = useDispatch();

  const FORM = [
    {
      key: "forname",
      placeholder: intlData.messages.Case.forename,
      value: "",
      onChangeText: null,
      keyboardType: "default",
    },
    {
      key: "lastname",
      placeholder: intlData.messages.Case.lastname,
      value: "",
      onChangeText: null,
      keyboardType: "default",
    },
    {
      key: "sex",
      placeholder: intlData.messages.Case.sex,
      value: null,
      icons: [
        { name: "woman", icon: require("../icons/woman.png") },
        { name: "man", icon: require("../icons/man.png") },
        { name: "unknown", icon: require("../icons/unknown.png") }
      ]
    },
    {
      key: "age",
      placeholder: intlData.messages.Case.age,
      value: null,
      icons: [
        { name: "kid", icon: require("../icons/kid.png") },
        { name: "man", icon: require("../icons/man.png") },
        { name: "grandpa", icon: require("../icons/grandpa.png") }
      ]
    },
    {
      key: "injuries",
      placeholder: intlData.messages.Case.injury,
      value: "",
      onChangeText: null,
      keyboardType: "default",
    },
  ];

  const isCaseEmpty = () => {
    return FORM.every((element) => element.value === "");
  };

  //Change the back button onpress beahviour and disable swipe back
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            if (!existingCase && !isCaseEmpty()) {
              Alert.alert(intlData.messages.Case.confirmBack, "", [
                {
                  text: intlData.messages.yes,
                  onPress: () => {
                    dispatch(deleteCase(caseID));
                    if (images.length > 0) {
                      images.forEach((image) => {
                        deleteImageFromMemory(image.id);
                      });
                    }
                    deleteCameraCache();
                    navigation.goBack();
                  },
                },
                {
                  text: intlData.messages.no,
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

  const isCaseComplete = () => {
    if (images.length === 0) {
      alert(intlData.messages.Case.addImage);
      return false;
    }
    const keyValues = FORM.map((element) => {
      return { [element.key]: element.value };
    });
    //if a value is empty send an alert
    const emptyValues = keyValues.filter((element) => {
      return element[Object.keys(element)[0]] === "";
    });
    if (emptyValues.length > 0) {
      alert(intlData.messages.Case.allFields);
      return false;
    }
    return true;
  };

  const save = () => {
    if (!isCaseComplete()) return;
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
    Vibration.vibrate();
    if (existingCase) {
      dispatch(editCase(data));
      navigation.navigate("ShowCase");
    } else {
      dispatch(saveCase(data));
      navigation.navigate("Home", { notification: true });
    }
  };

  const submit = async () => {
    if (!isCaseComplete()) return;
    const keyValues = FORM.map((element) => {
      return { [element.key]: element.value };
    });
    const keyValuesObject = Object.assign({}, ...keyValues);
    const imageIDs = images.map((image) => image.id);
    const coordinates = images.map((image) => {
      return {
        id: image.id,
        latitude: image.lat,
        longitude: image.lng,
      };
    });
    const data = {
      id: caseID,
      ...keyValuesObject,
      images: imageIDs,
      date: new Date().toISOString(),
      coordinates: coordinates,
    };
    const path = await createZip(data);
    //Check if mail is available
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      alert(intlData.messages.Case.noMail);
      return;
    }
    MailComposer.composeAsync({
      recipients: ["sample@gmail.com"],
      subject: intlData.messages.Mail.subject + caseID,
      body: intlData.messages.Mail.body,
      isHtml: true,
      attachments: [path],
    }).then(() => {
      deleteZip(caseID);
    });
  };

  const setCaseImages = () => {
    if (props.images && props.images.length > 0) {
      const DATA = props.images.filter((image) => image.caseID === caseID);
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


  //function called when an icon is selected for the sex
  const handleIconSelectionSex = (selectedIconSex) => {
    // Set the selected icon value
    setSelectedIconSex(selectedIconSex);
    const sexItem = FORM.find((item) => item.key === "sex");
    const selectedIndex = sexItem.icons.findIndex((iconOption) => iconOption.icon === selectedIconSex);
    if (selectedIndex !== -1) {
      const selectedIconName = sexItem.icons[selectedIndex].name;
      console.log(selectedIconName);
      FORM.find((item) => item.key === "sex").value = selectedIconName;
    }
  };


  //function called when an icon is selected for the age
  const handleIconSelectionAge = (selectedIconAge) => {
    // Set the selected icon value
    setSelectedIconAge(selectedIconAge);
    const ageItem = FORM.find((item) => item.key === "age");
    const selectedIndex = ageItem.icons.findIndex((iconOption) => iconOption.icon === selectedIconAge);
    if (selectedIndex !== -1) {
      const selectedIconName = ageItem.icons[selectedIndex].name;
      console.log(selectedIconName);
      FORM.find((item) => item.key === "age").value = selectedIconName;
    }
  };

  const renderItem = ({ item }) => {
    if (item.key === "age" || item.key === "sex") {
      return (
        <View style={styles.inputContainer}>
          <Text style={[styles.placeholder, { marginBottom: 10 }]}>{item.placeholder}</Text>
          <ScrollView horizontal contentContainerStyle={[styles.iconContainer, { marginBottom: 20 }]}>
            {item.icons.map((iconOption, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.iconButton,
                  { marginRight: 40 },
                  (item.key === "age" && selectedIconAge === iconOption.icon) ||
                  (item.key === "sex" && selectedIconSex === iconOption.icon)
                    ? styles.selectedIconButton
                    : null,
                ]}
                onPress={() =>
                  item.key === "age"
                    ? handleIconSelectionAge(iconOption.icon)
                    : handleIconSelectionSex(iconOption.icon)
                }
              >
                <Image source={iconOption.icon} style={styles.icon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.inputContainer}>
        <ScanInput
          placeholder={item.placeholder}
          value={item.value}
          onChangeText={item.onChangeText}
          keyboardType={item.keyboardType}
        />
      </View>
    );
  };
  const renderImage = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("Pictures", { caseID: item.caseID })}
    >
      <Image
        source={{ uri: item.data }}
        style={{ width: 150, height: 150, margin: 10 }}
        blurRadius={100}
      />
    </Pressable>
  );

  return (
    <Pressable
      style={styles.mainContent}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
    >
      <FlatList
        data={FORM.filter((item) => item.key !== "injuries")}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={<View style={{ height: 20 }} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
        style={{ flexGrow: 0, flexShrink: 0 }}
        scrollEnabled={false}
      />
      <TextInput
        editable
        multiline
        numberOfLines={4}
        placeholder={FORM[4].placeholder}
        value={FORM[4].value}
        onChangeText={FORM[4].onChangeText}
        keyboardType={FORM[4].keyboardType}
        style={styles.injuries}
        placeholderTextColor={
          props.theme.mode === "light" ? "#B3B3B3" : "#B3B3B39C"
        }
      />
      <ScanButton
        title={intlData.messages.Case.photoButton}
        onPress={() => navigation.navigate("Camera", { caseID: caseID })}
      />
      <Text style={{ fontStyle: "italic" }}>
        {intlData.messages.Case.descriptionPhoto}
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
        <LittleScanButton
          title={intlData.messages.Case.saveButton}
          onPress={() => {
            save();
          }}
        />
        <LittleScanButton
          title={intlData.messages.Case.submitButton}
          onPress={() => {
            submit();
          }}
        />
      </View>
    </Pressable>
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
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
  selectedIconButton: {
    borderColor: '#D3D3D3',
    backgroundColor: '#D3D3D3',
    borderWidth: 2,
    borderRadius: 10,
  }
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
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Case);
