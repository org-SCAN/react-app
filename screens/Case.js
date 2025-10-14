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
import DescriptionField from "../components/Case/DescriptionField";
import CaseIdField from "../components/Case/CaseIdField";
import AgeField from "../components/Case/AgeField";

const Case = (props) => {
  const styles = props.theme.mode === "light" ? lightStyles : darkStyles;
  const { intlData } = props;
  const { navigation } = props;

  // ✅ Séparation claire : UUID interne vs étiquette saisie
  const [caseUUID, setCaseUUID] = useState(null);   // ID technique interne (UUID)
  const [caseID, setCaseID] = useState("");         // Étiquette saisie par l'utilisateur (affichage/recherche)

  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [tag, setTag] = useState("");               // miroir de l'étiquette pour compat
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // null, 'types', 'gender'

  // Miroir: tag == caseID (compat)
  useEffect(() => {
    setTag((caseID || "").trim());
  }, [caseID]);

  // Gestion menu déroulant
  const handleDropdownOpen = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };
  const handleDropdownClose = () => setOpenDropdown(null);

  const [alertVisibleFieldMissing, setAlertVisibleFieldMissing] = useState(false);
  const [alertMessage, setAlertMessage] = useState(false);
  const [alertTitle, setAlertTitle] = useState(false);
  const [alertVisibleNoMail, setAlertVisibleNoMail] = useState(false);
  const [alertVisibleNoMailAddress, setAlertVisibleNoMailAddress] = useState(false);
  const [alertVisibleGoBack, setAlertVisibleGoBack] = useState(false);
  const [alertVisibleNoLocationPermission, setAlertVisibleNoLocationPermission] = useState(false);

  const dispatch = useDispatch();

  const cases = useSelector(state => state.case.cases);
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);
  const email = useSelector(state => state.email.email);
  const permissionStatus = useSelector(state => state.location.permissionStatus);
  const customField = useSelector(state => state.customField.customField);
  const types = useSelector(state => state.typeAvailable.types);

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
    const noDescription = description === "";
    const noImages = images.length === 0;
    const noCaseLabel = !caseID || caseID.trim() === "";
    return noGender && noAge && noDescription && noImages && noCaseLabel;
  };

  // Header back
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            if (!existingCase && !isCaseEmpty()) {
              setAlertVisibleGoBack(true);
            } else {
              navigation.goBack();
            }
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
  }, [navigation, existingCase, selectedGender, selectedAge, description, images, caseID]);

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
    if (!caseID || caseID.trim() === "") {
      setAlertMessage(`${intlData.messages.Case.caseIDRequired}`);
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
      id: caseUUID,              // ✅ UUID technique
      tag: tag,                  // miroir de l’étiquette (optionnel)
      sex: selectedGender,
      age: selectedAge,
      images: imageIDs,
      caseID: caseID,            // ✅ étiquette saisie
      description: description,
      date: new Date().toISOString(),
    };
    Vibration.vibrate();
    if (existingCase) {
      dispatch(editCase(data));
      navigation.navigate("ShowCase");
    } else {
      dispatch(saveCase(data));
      dispatch(updateCaseNumber(caseNumber + 1)); // incrémente uniquement à la création
      navigation.replace('Home', { notification: true, noCrashCheck: true });
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
      id: caseUUID,              // ✅ UUID technique
      tag: tag,
      customField: customField,
      description: description,
      sex: selectedGender,
      age: selectedAge,
      images: imageIDs,
      caseID: caseID,            // ✅ étiquette saisie
      date: new Date().toISOString(),
      coordinates: coordinates,
    };
    try {
      const path = await createZip(data);
      if (!path) {
        console.error("Attachment path is invalid.");
        setLoading(false);
        return;
      }
      const isMailAvailable =
        Platform.OS === 'ios'
          ? await MailComposer.isAvailableAsync()
          : await Linking.canOpenURL('mailto:');

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
      await MailComposer.composeAsync({
        recipients: [email],
        // Optionnel: utiliser l'étiquette si dispo, sinon UUID
        subject: intlData.messages.Mail.subject + (caseID || caseUUID),
        body: intlData.messages.Mail.body,
        isHtml: true,
        attachments: [path],
      });
      setLoading(false);
      // incrémente uniquement à la création
      if (!existingCase) {
        dispatch(updateCaseNumber(caseNumber + 1));
      }
      setTimeout(() => {
        deleteZip(caseUUID);
      }, 3000);
    } catch (error) {
      setLoading(false);
      console.error("Failed to send email:", error);
    }
  };

  const setCaseImages = () => {
    if (props.images && props.images.length > 0) {
      // ✅ lier via l’UUID interne
      const DATA = props.images.filter((image) => image.caseID === caseUUID);
      setImages(DATA);
    } else {
      setImages([]);
    }
  };

  useEffect(() => {
    if (props.route.params && props.route.params.caseId) {
      // ---- Cas existant ----
      const mcase = props.cases.filter(
        (item) => item.id === props.route.params.caseId
      )[0];
      setExistingCase(mcase);
      setCaseUUID(mcase.id);                               // UUID sauvé
      setCaseID(mcase.caseID || mcase.tag || "");          // étiquette visible (fallback ancien tag)
      setSelectedGender(mcase.sex);
      setSelectedAge(mcase.age);
      setDescription(mcase.description || "");
    } else if (props.route.params && props.route.params.images) {
      // ---- Nouveau via images (crash) ----
      const crashImage = props.route.params.images;
      setImages(crashImage);
      setCaseUUID(crashImage[0].caseID);                   // UUID depuis les images
      setCaseID("");                                       // étiquette à saisir
    } else {
      // ---- Nouveau cas ----
      const newCaseId = uuid.v4();
      setCaseUUID(newCaseId);                              // UUID neuf
      setCaseID("");                                       // étiquette à saisir
    }
  }, [cases, props.route.params]);

  useEffect(() => {
    if (caseUUID) {
      setCaseImages();
    }
  }, [caseUUID, props.images]);

  const handleDescriptionChange = () => {
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
    navigation.navigate("Camera", { caseID: caseUUID }); // ✅ passer l’UUID
  };

  return (
    <View style={styles.mainContent}>
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
        <CaseIdField
          value={caseID}
          onChangeText={setCaseID}
          onBlur={() => {}}
        />

        {/* Sexe */}
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

        {/* Âge */}
        <AgeField
          style={styles}
          value={selectedAge}
          onChangeText={setSelectedAge}
        />

        {/* Description */}
        <DescriptionField
          style={styles}
          value={description}
          onChangeText={setDescription}
          onBlur={handleDescriptionChange}
        />

        {/* Photos */}
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
            </View>
          )}
        </View>

        <View style={styles.twoButtonsContainer}>
          <ScanButton
            subtitle={intlData.messages.Case.saveButton}
            onPress={save}
            name="save-alt"
            type="material-icons"
            styleIcon={styles.bottomIcon}
            styleText={styles.bottomText}
            styleButton={styles.bottomButton}
          />
          <ScanButton
            subtitle={intlData.messages.Case.submitButton}
            onPress={submit}
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
          dispatch(deleteCase(caseUUID));                 // ✅ supprimer via UUID
          images.forEach((image) => deleteImageFromMemory(image.id));
          deleteCameraCache();
          navigation.goBack();
        }}
        onCancel={() => setAlertVisibleGoBack(false)}
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

function scaleWidth(size) { return Math.round((width / baseWidth) * size); }
function scaleHeight(size) { return Math.round((height / baseHeight) * size); }
function scale(size) { return Math.round((size * (width / baseWidth + height / baseHeight)) / 2); }
function responsiveInput() { return Math.round(scaleWidth(280)/scaleWidth(300)*100); }

const basicStyles = StyleSheet.create({
  mainContent: { flex: 1 },
  activityContainer: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "center", zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scrollViewContent: {
    flexGrow: 1, padding: scale(20), justifyContent: 'space-between',
  },
  multipleFieldsContainer: { flex: 1, alignItems: "center" },
  tagLabel: {
    fontSize: scale(45), fontWeight: "600",
    marginBottom: scaleHeight(20), textAlign: "center",
  },
  inputContainer: { marginVertical: scaleHeight(2)},
  input: {
    width: `${responsiveInput()}%`, marginVertical: 5,
    borderWidth: 1, borderRadius: 5, shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1, paddingLeft: 8, paddingTop: 8, paddingBottom: 8,
    minHeight: scaleHeight(40),
  },
  placeholder: {
    marginBottom: scaleHeight(7), marginTop: scaleHeight(7),
    fontSize: scale(17), fontWeight: "bold",
  },
  iconContainer: {
    alignItems: "flex-start", flexDirection: "row", justifyContent: "center",
    marginBottom: scaleHeight(10),
  },
  iconButton: {
    padding: scale(10), borderRadius: scale(12), borderWidth: scaleWidth(2),
    marginLeft: scaleWidth(15), marginRight: scaleWidth(15),
  },
  selectedIconButton: {
    padding: scale(10), borderRadius: scale(12), borderWidth: scaleWidth(2),
    marginLeft: scaleWidth(15), marginRight: scaleWidth(15),
  },
  icon: { width: scaleWidth(70), height: scaleHeight(70), resizeMode: "stretch" },
  descriptionPhoto: {
    fontStyle: "italic", fontSize: scale(14),
    marginBottom: scaleHeight(15), textAlign: "center",
  },
  imageContainer: {
    borderWidth: 5, borderRadius: 10, shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
  },
  imageCase: {
    width: scaleWidth(80), height: scaleHeight(120),
    marginHorizontal: scaleWidth(5), borderRadius: scale(5),
  },
  twoButtonsContainer: {
    marginTop: scaleHeight(15), flexDirection: "row",
    justifyContent: "center", alignSelf: "center",
  },
  cameraButton: {
    justifyContent: "center", alignItems: "center",
    paddingVertical: scaleHeight(5), borderRadius: scale(4),
    elevation: 3, borderWidth: scaleWidth(2), marginVertical: scaleHeight(10),
    width: scaleWidth(150), shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  cameraIcon: { justifyContent: "center", alignItems: "center", textAlign: "center" },
  bottomButton: {
    borderRadius: 4, elevation: 3, borderWidth: 2, margin: 10, marginBottom: 10,
    width: scaleWidth(175), height: scaleHeight(60), justifyContent: "center",
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4,
  },
  bottomIcon: { size: scale(33) },
  bottomText: {
    fontSize: scale(14), lineHeight: 21, fontWeight: "bold", textAlign: "center",
  },
});

const lightStyles = StyleSheet.create({
  ...basicStyles,
  tagLabel: { ...basicStyles.tagLabel, color: THEME_COLOR.LIGHT.MAIN_TEXT },
  placeholder: { ...basicStyles.placeholder, color: THEME_COLOR.LIGHT.MAIN_TEXT },
  input: {
    ...basicStyles.input,
    borderColor: THEME_COLOR.LIGHT.INPUT,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    color: THEME_COLOR.LIGHT.INPUT_TEXT,
  },
  placeholderDescripton: { color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER },
  descriptionPhoto: { ...basicStyles.descriptionPhoto, color: THEME_COLOR.LIGHT.TERTIARY_TEXT },
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
  bottomText: { ...basicStyles.bottomText, color: THEME_COLOR.LIGHT.BUTTON_TEXT },
});

const darkStyles = StyleSheet.create({
  ...basicStyles,
  tagLabel: { ...basicStyles.tagLabel, color: THEME_COLOR.DARK.MAIN_TEXT },
  input: {
    ...basicStyles.input,
    borderColor: THEME_COLOR.DARK.INPUT,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    color: THEME_COLOR.DARK.INPUT_TEXT,
  },
  placeholderDescripton: { color: THEME_COLOR.LIGHT.INPUT_PLACE_HOLDER },
  placeholder: { ...basicStyles.placeholder, color: THEME_COLOR.DARK.MAIN_TEXT },
  descriptionPhoto: { ...basicStyles.descriptionPhoto, color: THEME_COLOR.DARK.TERTIARY_TEXT },
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
  bottomText: { ...basicStyles.bottomText, color: THEME_COLOR.DARK.BUTTON_TEXT },
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