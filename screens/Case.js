import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
  Vibration,
  Pressable,
  Dimensions,
} from "react-native";
import ScanInput from "../components/BasicUI/ScanInput";
import ScanButton from "../components/BasicUI/ScanButton";
import ScanButtonCamera from "../components/BasicUI/ScanButtonCamera";
import LittleScanButton from "../components/BasicUI/LittleScanButton";
import uuid from "react-native-uuid";
import { useDispatch, useSelector, connect } from "react-redux";
import { saveCase, editCase, deleteCase, updateCaseNumber } from "../redux/actions";
import { HeaderBackButton } from '@react-navigation/elements';
import { Alert, ScrollView } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { deleteCameraCache } from "../utils/cacheManager";
import { createZip } from "../utils/fileHandler";
import { deleteImageFromMemory, deleteZip } from "../utils/fileHandler";
import CustomAlert from "../components/Case/CustomAlert";
import CustomAlertTwoButtons from "../components/Case/CustomAlertTwoButtons";


const Case = (props) => {
  const styles = props.theme.mode === "light" ? lightStyles : darkStyles;
  const { intlData } = props;
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedIconAge, setSelectedIconAge] = useState(null);
  const [selectedIconSex, setSelectedIconSex] = useState(null);
  const [tag, setTag] = useState(null);
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  const [alertVisibleFieldMissing, setAlertVisibleFieldMissing] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(false); 
  const [alertTitle, setAlertTitle] = useState(false);

  const [alertVisibleGoBack, setAlertVisibleGoBack] = useState(false); 
  const dispatch = useDispatch();

  const cases = useSelector(state => state.case.cases);
  const userId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const email = useSelector(state => state.email.email);

  //const tag = `${userId}-${caseNumber}`;

  const FORM = [
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
        { name: "child", icon: require("../icons/child.png") },
        { name: "adult", icon: require("../icons/adult.png") },
        { name: "old", icon: require("../icons/old.png") }
      ]
    } 
  ]; 


  const [form, setform] = useState(FORM)
  
  const isCaseEmpty = () => {
    const allFieldsEmpty = form.every((element) => element.value === null || element.value === "");
    const noImages = images.length === 0;
  
    return allFieldsEmpty && noImages;
  };

  //Change the back button onpress beahviour and disable swipe back
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => (
        <HeaderBackButton
          {...props}
          onPress={() => {
            // Ensure state logic does not trigger re-renders unnecessarily
            if (!existingCase && !isCaseEmpty()) {
              setAlertVisibleGoBack(true); // Show alert before navigating back
            } else {
              navigation.goBack(); // Navigate back
            }
          }}
        />
      ),
      gestureEnabled: false, // Disable gestures for controlled navigation
    });
  }, [navigation, existingCase, isCaseEmpty]); // Use minimal dependencies

  


  const isCaseComplete = () => {
    if (images.length === 0) {
      setAlertMessage(`${intlData.messages.Case.addImage}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    const keyValues = form.map((element) => {
      return { [element.key]: element.value };
    });

    const allEmpty = keyValues.every((element) => {
      const value = Object.values(element)[0];
      return value === "" || value === null;
    });

    if (allEmpty) {
      setAlertMessage(`${intlData.messages.Case.noIcons}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    const missingSex = keyValues.find((element) => element.sex === null);
    if (missingSex) {
      setAlertMessage(`${intlData.messages.Case.noIconSex}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    const missingAge = keyValues.find((element) => element.age === null);
    if (missingAge) {
      setAlertMessage(`${intlData.messages.Case.noIconAge}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    return true;
};

  const save = () => {
    if (!isCaseComplete()) return;
    const keyValues = form.map((element) => {
      return { [element.key]: element.value };
    });
    const keyValuesObject = Object.assign({}, ...keyValues);
    const imageIDs = images.map((image) => image.id);
    const data = {
      id: caseID,
      tag: tag,
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
    const keyValues = form.map((element) => {
      return { [element.key]: element.value };
    });
    //handleCreateCase();
    const keyValuesObject = Object.assign({}, ...keyValues);
    const imageIDs = images.map((image) => image.id);
    const coordinates = images.map((image) => {
      return {
        id: image.id,
        latitude: image.lat,
        longitude: image.lng,
      };
    });
    console.log("user id =", userId)
    console.log("tag= ", tag)
    const data = {
      id: caseID,
      tag: tag,
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
      recipients: [email],
      subject: intlData.messages.Mail.subject + caseID,
      body: intlData.messages.Mail.body,
      isHtml: true,
      attachments: [path],
    }).then(() => {
      deleteZip(caseID);
    });
    console.log("Updated FORM finalee:", form);
    setReadyToSubmit(false); // reset the readyToSubmit state

  };

  const setCaseImages = () => {
    if (props.images && props.images.length > 0) {
        const DATA = props.images.filter((image) => image.caseID === caseID);
        setImages(DATA);
    } else {
        setImages([]);
    }
  };

  const handleCreateCase = () => {
    dispatch(updateCaseNumber(caseNumber+1));
  };

  const handleDeleteCase = () => {
    dispatch(updateCaseNumber(caseNumber-1));
  };

    useEffect(() => {
      if (props.route.params && props.route.params.caseId) {
        const mcase = props.cases.filter(
          (item) => item.id === props.route.params.caseId
        )[0];
        setExistingCase(mcase);
        setCaseID(mcase.id);
        setTag(mcase.tag); // Set tag from existing case
        const updatedForm = form.map((item) => {
          if (item.key === "age") {
            item.value = mcase.age;
            setSelectedIconAge(item.icons.find(icon => icon.name === mcase.age).icon);
          } else if (item.key === "sex") {
            item.value = mcase.sex;
            setSelectedIconSex(item.icons.find(icon => icon.name === mcase.sex).icon);
          }
          return item;
        });
        setform(updatedForm);
      } else {
        const newCaseId = uuid.v4();
        setCaseID(newCaseId);
        setTag(`${userId}-${caseNumber}`);
      }
    }, [cases, props.route.params]);

    useEffect(() => {
      if (caseID) {
        setCaseImages();
      }
    }, [caseID, props.images]);


//function called when an icon is selected for the sex
const handleIconSelectionSex = (selectedIconSex) => {
  const updatedForm = form.map((item ) => {
    // Set the selected icon value
    setSelectedIconSex(selectedIconSex);
    const sexItem = form.find((item) => item.key === "sex");
    const selectedIndex = sexItem.icons.findIndex((iconOption) => iconOption.icon === selectedIconSex);
    if (selectedIndex !== -1) {
      const selectedIconName = sexItem.icons[selectedIndex].name;
      console.log(selectedIconName);
      form.find((item) => item.key === "sex").value = selectedIconName;
    }
    return item;
    });
  setform(updatedForm);  
  console.log("Updated FORM:", updatedForm);
};


//function called when an icon is selected for the age
const handleIconSelectionAge = (selectedIconAge) => {
  const updatedForm = form.map((item ) => {
    // Set the selected icon value
    setSelectedIconAge(selectedIconAge);
    const ageItem = form.find((item) => item.key === "age");
    const selectedIndex = ageItem.icons.findIndex((iconOption) => iconOption.icon === selectedIconAge);
    if (selectedIndex !== -1) {
      const selectedIconName = ageItem.icons[selectedIndex].name;
      console.log(selectedIconName);
      form.find((item) => item.key === "age").value = selectedIconName;
    }
    return item;
  });
  setform(updatedForm);  
  console.log("Updated FORM:", updatedForm)
};


  const renderItem = ({ item }) => {
    if (item.key === "age" || item.key === "sex") {
      return (
        <View style={styles.inputContainer}>
          <Text style={[styles.placeholder]}>{item.placeholder}</Text>
          <ScrollView horizontal contentContainerStyle={[styles.iconContainer, { marginBottom: 20 }]}>
            {item.icons.map((iconOption, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.iconButton,
                  (item.key === "age" && selectedIconAge === iconOption.icon) ||
                  (item.key === "sex" && selectedIconSex === iconOption.icon)
                    ? styles.selectedIconButton
                    : null,
                ]}
                onPress={() => {
                  if (item.key === "age") {
                    handleIconSelectionAge(iconOption.icon);
                  } else if (item.key === "sex") {
                    handleIconSelectionSex(iconOption.icon);
                  }
                }}
              >
                <Image source={iconOption.icon} style={styles.icon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }
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
      <Text style={styles.tagLabel}>{tag}</Text>
  
    <CustomAlert
      title={alertTitle}
      message={alertMessage}
      onConfirm={() => setAlertVisibleFieldMissing(false)}
      visible={alertVisibleFieldMissing}
    />

    <CustomAlertTwoButtons
      title="⚠️"
      message={intlData.messages.Case.confirmBack}
      onConfirm={() => {
        setAlertVisibleGoBack(false);
        dispatch(deleteCase(caseID));
        handleDeleteCase();
        images.forEach((image) => deleteImageFromMemory(image.id));
        deleteCameraCache();
        navigation.goBack();
      }}
      onCancel={() => {
        setAlertVisibleGoBack(false);
      }}
      visible={alertVisibleGoBack}
      confirmButtonText={intlData.messages.yes}
      cancelButtonText={intlData.messages.no}
    />


  
      {/* Rendu du formulaire */}
      <FlatList
        data={form.filter((item) => item.key !== "injuries")}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={<View style={{ height: 20 }} />}
        ListFooterComponent={<View style={{ height: 20 }} />}
        style={{ flexGrow: 0, flexShrink: 0 }}
        scrollEnabled={false}
      />
  
      {/* Rendu de l'image et des autres éléments */}
      <ScanButtonCamera
        onPress={() => navigation.navigate("Camera", { caseID: caseID })}
        imageSource={require('../icons/camera1.png')}
      />
  
      <Text style={styles.descriptionPhoto}>
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

const { width, height } = Dimensions.get("window");
// Reference emulated device
const baseWidth = 411.42857142857144; 
const baseHeight = 890.2857142857143; 

function scaleWidth(size) {
  return Math.round((width / baseWidth) * size);
}

function scaleHeight(size) {
  return Math.round((height / baseHeight) * size);
}

function scale(size) {
  return Math.round((size * (width / baseWidth + height / baseHeight)) / 2);
}
const basicStyles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: "center",
    padding: scaleWidth(2),
  },
  // IDs
  tagLabel: {
    fontSize: scale(45),
    fontWeight: "600",
    marginTop: scaleHeight(20),
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  // Description of icons
  placeholder: {
    marginBottom: scaleHeight(5),
    marginTop: scaleHeight(5),
    fontSize: scale(17),
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: scaleHeight(5),
  },
  iconButton: {
    padding: scale(14),
    borderRadius: scale(12),
    borderWidth: scaleWidth(2),
    marginLeft: scaleWidth(15),
    marginRight: scaleWidth(15),
  },
  selectedIconButton: {
    padding: scale(14),
    borderRadius: scale(12),
    borderWidth: scaleWidth(2),
    marginLeft: scaleWidth(15),
    marginRight: scaleWidth(15),
  },
  icon: {
    width: scaleWidth(60),
    height: scaleHeight(60),
    resizeMode: "contain",
  },
  // Description under camera button
  descriptionPhoto: {
    fontStyle: "italic",
    fontSize: scale(14),
    textAlign: "center",
  },
  // Submit / Save buttons
  button: {
    position: "absolute",
    bottom: scaleHeight(20),
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    alignSelf: "center",
  },
});

const lightStyles = StyleSheet.create({
  ...basicStyles,
  tagLabel: {
    ...basicStyles.tagLabel,
    color: "black",
  },
  placeholder: {
    ...basicStyles.placeholder,
    color: "#000",
  },
  descriptionPhoto: {
    ...basicStyles.descriptionPhoto,
    color: "#444",
  },
  iconButton: {
    ...basicStyles.iconButton,
    borderColor: "#D3D3D3",
    backgroundColor: "white",
  },
  selectedIconButton: {
    ...basicStyles.selectedIconButton,
    backgroundColor: "rgba(184, 29, 42, 0.8)",
    borderColor: "rgba(184, 29, 42, 0.8)",
  },
});

const darkStyles = StyleSheet.create({
  ...basicStyles,
  tagLabel: {
    ...basicStyles.tagLabel,
    color: "white",
  },
  placeholder: {
    ...basicStyles.placeholder,
    color: "white",
  },
  descriptionPhoto: {
    ...basicStyles.descriptionPhoto,
    color: "#b3b3b3",
  },
  iconButton: {
    ...basicStyles.iconButton,
    borderColor: "#D3D3D3",
    backgroundColor: "white",
  },
  selectedIconButton: {
    ...basicStyles.selectedIconButton,
    backgroundColor: "rgba(184, 29, 42, 0.8)",
    borderColor: "rgba(184, 29, 42, 0.8)",
  },
});


function mapStateToProps(state) {
  return {
    images: state.image.image,
    cases: state.case.cases,
    theme: state.theme,
    intlData: state.lang,
    //tag: state.tag,
  };
}

export default connect(mapStateToProps)(Case);