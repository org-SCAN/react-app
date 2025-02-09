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
  TextInput,
  Platform,
  Linking,
} from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";
import uuid from "react-native-uuid";
import { useDispatch, useSelector, connect } from "react-redux";
import { saveCase, editCase, deleteCase, updateCaseNumber } from "../redux/actions";
import { ScrollView } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { deleteCameraCache } from "../utils/cacheManager";
import { createZip } from "../utils/fileHandler";
import { deleteImageFromMemory, deleteZip } from "../utils/fileHandler";
import CustomAlert from "../components/Alert/CustomAlert";
import CustomAlertTwoButtons from "../components/Alert/CustomAlertTwoButtons";
import { Icon } from "@rneui/themed";
import { THEME_COLOR } from "../theme/constants";

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
  const [description, setDescription] = useState("");

  const [alertVisibleFieldMissing, setAlertVisibleFieldMissing] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(false); 
  const [alertTitle, setAlertTitle] = useState(false);
  const [alertVisibleNoMail, setAlertVisibleNoMail] = useState(false);
  const [alertVisibleNoMailAddress, setAlertVisibleNoMailAddress] = useState(false);

  const [alertVisibleGoBack, setAlertVisibleGoBack] = useState(false); 
  const [alertVisibleNoLocationPermission, setAlertVisibleNoLocationPermission] = useState(false);
  
  const dispatch = useDispatch();

  const cases = useSelector(state => state.case.cases);
  const userId = useSelector(state => state.userId.userId);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const email = useSelector(state => state.email.email);
  const iconPath = useSelector(state => state.iconPath.iconPath);
  const iconPersonalized = useSelector(state => state.icon.icon);
  const permissionStatus = useSelector(state => state.location.permissionStatus);
  const customField = useSelector(state => state.customField.customField);

  const FORM = [
    {
      key: "sex",
      placeholder: intlData.messages.Case.sex,
      value: null,
      icons: [
        { name: "woman", icon: iconPersonalized ? `${iconPath}woman.png` : require("../icons/woman.png") }, // Credit to https://www.flaticon.com/authors/vitaly-gorbachev
        { name: "man", icon: iconPersonalized ? `${iconPath}man.png` : require("../icons/man.png") }, // Credit to https://www.flaticon.com/authors/vitaly-gorbachev
        { name: "unknown", icon: iconPersonalized ? `${iconPath}unknown.png` : require("../icons/unknown.png") }, // Credit to https://www.flaticon.com/authors/freepik
      ]
    },
    {
      key: "age",
      placeholder: intlData.messages.Case.age,
      value: null,
      icons: [
        { name: "child", icon: iconPersonalized ? `${iconPath}child.png` : require("../icons/child.png") }, // Credit to https://www.flaticon.com/authors/edtim
        { name: "adult", icon: iconPersonalized ? `${iconPath}adult.png` : require("../icons/adult.png") }, // Credit to https://www.flaticon.com/authors/leremy
        { name: "old", icon: iconPersonalized ? `${iconPath}old.png` : require("../icons/old.png") } // Credit to https://www.flaticon.com/authors/freepik
      ]
    },
    {
      key: "description",
      placeholder: intlData.messages.Case.description,
      placeholderTitle: intlData.messages.Case.descriptionTitle,
      value: null,
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
        <Icon
          {...props}
          name={existingCase ? "folder-search" : "home"} 
          size={35} 
          color="white"
          type={existingCase ? "material-community" : "material-icons-outlined"} 
          onPressIn={() => {
            // Ensure state logic does not trigger re-renders unnecessarily
            if (!existingCase && !isCaseEmpty()) {
              setAlertVisibleGoBack(true); // Show alert before navigating back
            } else {
              navigation.goBack();
            }
            console.log("Case number after going back: ", caseNumber);
          }}
        />
      ),
      gestureEnabled: false, // Disable gestures for controlled navigation
    });
  }, [navigation, existingCase, isCaseEmpty]); // Use minimal dependencies
  


  useEffect(() => {
    if (permissionStatus === "denied") {
      setAlertVisibleNoLocationPermission(true);
    }
  }, [permissionStatus]);

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
      description: description,
      date: new Date().toISOString(),
    };
    Vibration.vibrate();
    if (existingCase) {
      dispatch(editCase(data));
      navigation.navigate("ShowCase");
    } else {
      dispatch(saveCase(data));
      handleCreateCase();
      navigation.navigate("Home", { notification: true });
    }
  };

  const submit = async () => {
    if (!isCaseComplete()) return;
    const keyValues = form.map((element) => ({ [element.key]: element.value }));
    const keyValuesObject = Object.assign({}, ...keyValues);
    const imageIDs = images.map((image) => image.id);
    const coordinates = images.map((image) => ({
      id: image.id,
      latitude: image.lat,
      longitude: image.lng,
    }));
    const data = {
      id: caseID,
      tag: tag,
      customField: customField,
      description: description,
      ...keyValuesObject,
      images: imageIDs,
      date: new Date().toISOString(),
      coordinates: coordinates,
    };
    console.log("Data to submit: ", data);
    const path = await createZip(data);
    if (!path) {
      console.error("Attachment path is invalid.");
      return;
    }
    const isMailAvailable =
      Platform.OS === 'ios'
        ? await MailComposer.isAvailableAsync()
        : await Linking.canOpenURL('mailto:');
  
    console.log(isMailAvailable);
    if (!isMailAvailable) {
      setAlertVisibleNoMail(true);
      return;
    }

    if (!email || email.trim() === "") {
      setAlertVisibleNoMailAddress(true);
      return;
    }
    try {
      await MailComposer.composeAsync({
        recipients: [email],
        subject: intlData.messages.Mail.subject + caseID,
        body: intlData.messages.Mail.body,
        isHtml: true,
        attachments: [path],
      });
      setTimeout(() => {
      deleteZip(caseID);
      }, 3000); // Pause de 3 secondes
    } catch (error) {
      console.error("Failed to send email:", error);
    }
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

  const initializeTag = () => {
    if (userId === '' || userId === null) {
      setTag(`default-${caseNumber}`);
    }
    else {
      setTag(`${userId}-${caseNumber}`);
    }
  };

  useEffect(() => {
    if (props.route.params && props.route.params.caseId) {
      const mcase = props.cases.filter(
        (item) => item.id === props.route.params.caseId
      )[0];
      console.log("Case: ", mcase);
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
        else if (item.key === "description") {
          item.value = mcase.description;
          setDescription(mcase.description);
        }
        return item;
      });
      setform(updatedForm);
    } else if (props.route.params && props.route.params.images) {
      const crashImage = props.route.params.images
      setImages(crashImage);
      setCaseID(crashImage[0].caseID);
      initializeTag();
    } else {
      const newCaseId = uuid.v4();
      setCaseID(newCaseId);
      initializeTag();
    }
  }, [cases, props.route.params]);

  useEffect(() => {
    if (caseID) {
      setCaseImages();
    }
  }, [caseID, props.images]);


  //function called when an icon is selected for the sex
  const handleIconSelectionSex = (selectedIconSex) => {
    const updatedForm = form.map((item) => {
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
    const updatedForm = form.map((item) => {
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


  const handleDescriptionChange = () => {
    const updatedForm = form.map((item) => {
      if (item.key === "description") {
        item.value = description;
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
          <View style={styles.iconContainer}>
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
                onPressOut={() => {
                  if (item.key === "age") {
                    handleIconSelectionAge(iconOption.icon);
                  } else if (item.key === "sex") {
                    handleIconSelectionSex(iconOption.icon);
                  }
                }}
              >
                <Image source={iconPersonalized ? {uri: iconOption.icon} : iconOption.icon} style={styles.icon} />
              </TouchableOpacity>
            ))}
          </View>
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
          style={styles.imageCase}
          blurRadius={60}
        />
      </Pressable>
  );

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < 0) {
      Keyboard.dismiss();
    }
  };

  const navigateToCamera = () => {
    navigation.navigate("Camera", { caseID: caseID });
  };

  return (
    <View
      style={styles.mainContent}
    >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.multipleFieldsContainer}>
            <Text style={styles.tagLabel}>{tag}</Text>
            {/* Rendu du formulaire Age et Sex */}
            <FlatList
              data={form.filter((item) => item.key !== "injuries")}
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
              style={{ flexGrow: 0 }}
              scrollEnabled={false}
            />
            {/* Description */}
            <View style={styles.inputContainer}> 
              <Text style={styles.placeholder}>{form.find((item) => item.key === "description").placeholderTitle}</Text>
              <View style={styles.iconContainer}>
                <TextInput
                  placeholder={form.find((item) => item.key === "description").placeholder}
                  placeholderTextColor={styles.placeholderDescripton.color}
                  style={styles.input}
                  textAlignVertical="top"
                  value={description}
                  multiline={true}
                  scrollEnabled={false}
                  onChangeText={setDescription}
                  onBlur={handleDescriptionChange}
                />
              </View>
            </View>

            {/* Rendu de l'image et des autres éléments */}
            <ScanButton 
              onPressIn={navigateToCamera}
              name="add-a-photo"
              size={34}
              type="material-icons"
              styleIcon={styles.cameraIcon}
              styleButton={styles.cameraButton}
            />

            <Text style={styles.descriptionPhoto}>
              {intlData.messages.Case.descriptionPhoto}
            </Text>
              {images.length > 0 && (
                <View style={styles.imageContainer}>
            <FlatList
              data={images}
              renderItem={renderImage}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              style={{ flexGrow: 0, flexShrink: 0 }}
              horizontal={true}
            />
              </View>)}
            </View>
            <View style={styles.twoButtonsContainer}>
              <ScanButton
                subtitle={intlData.messages.Case.saveButton}
                onPress={() => {
                  save();
                }}
                name="save-alt"
                type="material-icons"
                styleIcon={styles.bottomIcon}
                styleText={styles.bottomText}
                styleButton={styles.bottomButton}
              />
              <ScanButton
                subtitle={intlData.messages.Case.submitButton}
                onPress={() => {
                  submit();
                }}
                name="email"
                type="material-icons"
                styleIcon={styles.bottomIcon}
                styleText={styles.bottomText}
                styleButton={styles.bottomButton}
              />
            </View>
          </View>
        </ScrollView>
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
      <CustomAlert
        title="⚠️"
        message={intlData.messages.Case.noMail}
        onConfirm={() => setAlertVisibleNoMail(false)}
        visible={alertVisibleNoMail}
      />
      <CustomAlert
        title="⚠️"
        message={intlData.messages.Case.noMailAddress}
        onConfirm={() => setAlertVisibleNoMailAddress(false)}
        visible={alertVisibleNoMailAddress}
      />
      <CustomAlert
        title="❌📍"
        message={intlData.messages.Camera.noLocationPermission}
        onConfirm={() => setAlertVisibleNoLocationPermission(false)}
        visible={alertVisibleNoLocationPermission}
      />
    </View>
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

function responsiveInput() {
  return Math.round(scaleWidth(272)/scaleWidth(300)*100);
}
const basicStyles = StyleSheet.create({
  mainContent: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  multipleFieldsContainer: {
    flex: 1,
    alignItems: 'center',
  },
  // IDs
  tagLabel: {
    fontSize: scale(45),
    fontWeight: "600",
    marginVertical: scaleHeight(20),
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginVertical: scaleHeight(2),
  },
  input: {
    width: `${responsiveInput()}%`,
    borderWidth: 1,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    paddingLeft: 8,
    paddingTop: 8, 
    paddingBottom: 8,
    minHeight: scaleHeight(40),
  },
  // Description of icons
  placeholder: {
    marginBottom: scaleHeight(7),
    marginTop: scaleHeight(7),
    fontSize: scale(17),
    fontWeight: "bold",
  },
  iconContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: scaleHeight(10),  
  },
  iconButton: {
    padding: scale(10),
    borderRadius: scale(12),
    borderWidth: scaleWidth(2),
    marginLeft: scaleWidth(15),
    marginRight: scaleWidth(15),
  },
  selectedIconButton: {
    padding: scale(10),
    borderRadius: scale(12),
    borderWidth: scaleWidth(2),
    marginLeft: scaleWidth(15),
    marginRight: scaleWidth(15),
  },
  icon: {
    width: scaleWidth(70),
    height: scaleHeight(70),
    resizeMode: "stretch",
  },
  // Description under camera button
  descriptionPhoto: {
    fontStyle: "italic",
    fontSize: scale(14),
    marginBottom: scaleHeight(15),
    textAlign: "center",
  },
  // Images
  imageContainer: {
    borderWidth: 5,
    borderRadius: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
  },
  imageCase: {
    width: scaleWidth(80),
    height: scaleHeight(120),
    marginHorizontal: scaleWidth(5),
    borderRadius: scale(5),
  },
  // Submit / Save buttons
  twoButtonsContainer: {
    marginTop: scaleHeight(15),
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
  },
  cameraButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleHeight(5), 
    borderRadius: scale(4), 
    elevation: 3,
    borderWidth: scaleWidth(2), 
    marginVertical: scaleHeight(10),
    width: scaleWidth(150), 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  cameraIcon: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  bottomButton: {
    borderRadius: 4,
    elevation: 3,
    borderWidth: 2,
    margin: 10,
    marginBottom: 30,
    width: scaleWidth(175),
    height: scaleHeight(60),
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  bottomIcon: {
    size: scale(33),
  },
  bottomText: {
    fontSize: scale(14),
    lineHeight: 21,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const lightStyles = StyleSheet.create({
  ...basicStyles,
  tagLabel: {
    ...basicStyles.tagLabel,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  placeholder: {
    ...basicStyles.placeholder,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  input: {
    ...basicStyles.input,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  placeholderDescripton: {
    color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER,
  },
  descriptionPhoto: {
    ...basicStyles.descriptionPhoto,
    color: THEME_COLOR.LIGHT.TERTIARY_TEXT,
  },
  iconButton: {
    ...basicStyles.iconButton,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
  },
  selectedIconButton: {
    ...basicStyles.selectedIconButton,
    backgroundColor: THEME_COLOR.LIGHT.ICON_SELECTED,
    borderColor: THEME_COLOR.LIGHT.ICON_SELECTED,
  },
  cameraButton: {
    ...basicStyles.cameraButton,
    backgroundColor: THEME_COLOR.LIGHT.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.BUTTON_BORDER,
    shadowColor: THEME_COLOR.LIGHT.BUTTON_SHADOW,
  },
  imageContainer: {
    ...basicStyles.imageContainer,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
  },
  bottomButton: {
    ...basicStyles.bottomButton,
    backgroundColor: THEME_COLOR.LIGHT.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.LIGHT.BUTTON_BORDER,
    shadowColor: THEME_COLOR.LIGHT.BUTTON_SHADOW,
  },
  bottomText: {
    ...basicStyles.bottomText,
    color: THEME_COLOR.LIGHT.BUTTON_TEXT,
  },
});

const darkStyles = StyleSheet.create({
  ...basicStyles,
  tagLabel: {
    ...basicStyles.tagLabel,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  input: {
    ...basicStyles.input,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  placeholderDescripton: {
    color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER,
  },
  placeholder: {
    ...basicStyles.placeholder,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  descriptionPhoto: {
    ...basicStyles.descriptionPhoto,
    color: THEME_COLOR.DARK.TERTIARY_TEXT,
  },
  iconButton: {
    ...basicStyles.iconButton,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
  },
  selectedIconButton: {
    ...basicStyles.selectedIconButton,
    backgroundColor: THEME_COLOR.DARK.ICON_SELECTED,
    borderColor: THEME_COLOR.DARK.ICON_SELECTED,
  },
  cameraButton: {
    ...basicStyles.cameraButton,
    backgroundColor: THEME_COLOR.DARK.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.BUTTON_BORDER,
    shadowColor: THEME_COLOR.DARK.BUTTON_SHADOW,
  },
  imageContainer: {
    ...basicStyles.imageContainer,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
  },
  bottomButton: {
    ...basicStyles.bottomButton,
    backgroundColor: THEME_COLOR.DARK.BUTTON_BACKGROUND,
    borderColor: THEME_COLOR.DARK.BUTTON_BORDER,
    shadowColor: THEME_COLOR.DARK.BUTTON_SHADOW,
  },
  bottomText: {
    ...basicStyles.bottomText,
    color: THEME_COLOR.DARK.BUTTON_TEXT,
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