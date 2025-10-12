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
  ActivityIndicator
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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { THEME_COLOR } from "../theme/constants";
import CasePicker from "../components/Case/CasePicker";
import SimplePicker from "../components/Case/SimplePicker";
import EthnicityField from "../components/Case/EthnicityField";
import DescriptionField from "../components/Case/DescriptionField";

const Case = (props) => {
  const styles = props.theme.mode === "light" ? lightStyles : darkStyles;
  const { intlData } = props;
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [ethnicity, setEthnicity] = useState("");
  const [tag, setTag] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // null, 'types', 'gender', 'age'

  // Fonctions pour gérer l'ouverture/fermeture des menus déroulants
  const handleDropdownOpen = (dropdownName) => {
    // Si le menu est déjà ouvert, on le ferme
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      // Sinon, on ouvre le nouveau menu
      setOpenDropdown(dropdownName);
    }
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

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
  const types = useSelector(state => state.typeAvailable.types);

  // Options pour les menus déroulants avec vérification de sécurité
  const genderOptions = [
    { label: intlData.messages.Case.genderOptions?.woman || "Femme", value: "woman" },
    { label: intlData.messages.Case.genderOptions?.man || "Homme", value: "man" },
    { label: intlData.messages.Case.genderOptions?.unknown || "Inconnu", value: "unknown" }
  ];

  const ageOptions = [
    { label: intlData.messages.Case.ageOptions?.child || "Enfant (0-12 ans)", value: "child" },
    { label: intlData.messages.Case.ageOptions?.teen || "Adolescent (13-17 ans)", value: "teen" },
    { label: intlData.messages.Case.ageOptions?.adult || "Adulte (18-64 ans)", value: "adult" },
    { label: intlData.messages.Case.ageOptions?.senior || "Senior (65+ ans)", value: "senior" }
  ];
  
  const isCaseEmpty = () => {
    const noGender = selectedGender === null;
    const noAge = selectedAge === null;
    const noEthnicity = ethnicity === "";
    const noDescription = description === "";
    const noTypes = selectedTypes.length === 0;
    const noImages = images.length === 0;
  
    return noGender && noAge && noEthnicity && noDescription && noImages && noTypes;
  };

  //Change the back button onpress beahviour and disable swipe back
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            console.log("existingCase:", existingCase);
            console.log("isCaseEmpty():", isCaseEmpty());
            console.log("selectedGender:", selectedGender);
            console.log("selectedAge:", selectedAge);
            console.log("ethnicity:", ethnicity);
            console.log("description:", description);
            console.log("selectedTypes:", selectedTypes);
            console.log("images:", images);
            
            if (!existingCase && !isCaseEmpty()) {
              console.log("Afficher l'alerte de confirmation");
              setAlertVisibleGoBack(true);
            } else {
              console.log("Retour direct sans alerte");
              navigation.goBack();
            }
            console.log("Case number after going back: ", caseNumber);
          }}
          style={{ paddingHorizontal: 10 }}
        >
          {existingCase ? (
            <MaterialCommunityIcons name="folder-search" size={35} color="white" />
          ) : (
            <MaterialIcons name="home" size={35} color="white" />
          )}
        </Pressable>
      ),
      gestureEnabled: false,
    });
  }, [navigation, existingCase, selectedGender, selectedAge, ethnicity, description, selectedTypes, images]); // Use minimal dependencies
  


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
    console.log("Selected types: ", selectedTypes, selectedTypes.length === 0 && types.length > 0, types.length);
    if (selectedTypes.length === 0 && types.length > 0) {
      setAlertMessage(`${intlData.messages.Case.addType}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    if (selectedGender === null) {
      setAlertMessage(`${intlData.messages.Case.noIconSex}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    if (selectedAge === null) {
      setAlertMessage(`${intlData.messages.Case.noIconAge}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    return true;
};

  const save = () => {
    if (!isCaseComplete()) return;
    const imageIDs = images.map((image) => image.id);
    const data = {
      id: caseID,
      tag: tag,
      types: selectedTypes,
      sex: selectedGender,
      age: selectedAge,
      ethnicity: ethnicity,
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
    setLoading(true);
    const imageIDs = images.map((image) => image.id);
    const coordinates = images.map((image) => ({
      id: image.id,
      latitude: image.lat,
      longitude: image.lng,
    }));
    const data = {
      id: caseID,
      tag: tag,
      types: selectedTypes,
      customField: customField,
      description: description,
      sex: selectedGender,
      age: selectedAge,
      ethnicity: ethnicity,
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
      setLoading(false);
      setAlertVisibleNoMail(true);
      return;
    }

    if (!email || email.trim() === "") {
      setLoading(false);
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
      setLoading(false);
      setTimeout(() => {
      deleteZip(caseID);
      }, 3000); // Pause de 3 secondes
    } catch (error) {
      setLoading(false);
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
      setSelectedTypes(mcase.types);
      setTag(mcase.tag); // Set tag from existing case
      setSelectedGender(mcase.sex);
      setSelectedAge(mcase.age);
      setEthnicity(mcase.ethnicity || "");
      setDescription(mcase.description || "");
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


  const handleDescriptionChange = () => {
    // La description est déjà gérée par l'état local
    console.log("Description updated:", description);
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
      {loading && (
              <View style={styles.activityContainer}>
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <Text style={styles.tagLabel}>{tag}</Text>
            <View style={styles.inputContainer}> 
               <CasePicker 
                 style={styles} 
                 selectedTypes={selectedTypes} 
                 setSelectedTypes={setSelectedTypes}
                 isOpen={openDropdown === 'types'}
                 onOpen={() => handleDropdownOpen('types')}
                 onClose={handleDropdownClose}
               />
            </View>
            
            {/* Menu déroulant pour le sexe */}
            <View style={styles.inputContainer}>
              <SimplePicker 
                style={styles} 
                items={genderOptions}
                selectedValue={selectedGender}
                setSelectedValue={setSelectedGender}
                placeholder={intlData.messages.Case.sex}
                isOpen={openDropdown === 'gender'}
                onOpen={() => handleDropdownOpen('gender')}
                onClose={handleDropdownClose}
              />
            </View>
            
            {/* Menu déroulant pour l'âge */}
            <View style={styles.inputContainer}>
              <SimplePicker 
                style={styles} 
                items={ageOptions}
                selectedValue={selectedAge}
                setSelectedValue={setSelectedAge}
                placeholder={intlData.messages.Case.age}
                isOpen={openDropdown === 'age'}
                onOpen={() => handleDropdownOpen('age')}
                onClose={handleDropdownClose}
              />
            </View>
            
            {/* Champ ethnicité */}
            <EthnicityField 
              style={styles}
              value={ethnicity}
              onChangeText={setEthnicity}
            />
            
            {/* Description */}
            <DescriptionField 
              style={styles}
              value={description}
              onChangeText={setDescription}
              onBlur={handleDescriptionChange}
            />

            {/* Rendu de l'image et des autres éléments */}
            <View style={styles.multipleFieldsContainer}>
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
  return Math.round(scaleWidth(280)/scaleWidth(300)*100);
}
const basicStyles = StyleSheet.create({
  mainContent: {
    flex: 1,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: scale(20),
    justifyContent: 'space-between',
  },
  multipleFieldsContainer: {
    flex: 1,
    alignItems: "center",
  },
  // IDs
  tagLabel: {
    fontSize: scale(45),
    fontWeight: "600",
    marginBottom: scaleHeight(20),
    textAlign: "center",
  },
  inputContainer: {
    marginVertical: scaleHeight(2),
    flex: 1,
  },
  input: {
    width: `${responsiveInput()}%`,
    marginVertical: 5,
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
    marginBottom: 10,
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