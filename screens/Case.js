import React, { useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
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
import ConnectedBasePicker from "../components/Case/ConnectedBasePicker";
import IconSelector from "../components/Case/IconSelector";
import LabeledTextInput from "../components/Case/LabeledTextInput";
import formConfig from "../utils/formConfig.json";

// Static asset map for Metro bundler (no dynamic require)
const assetIconMap = {
  "icons/woman.png": require("../icons/woman.png"),
  "icons/man.png": require("../icons/man.png"),
  "icons/unknown.png": require("../icons/unknown.png"),
  "icons/child.png": require("../icons/child.png"),
  "icons/adult.png": require("../icons/adult.png"),
  "icons/old.png": require("../icons/old.png"),
};

const Case = (props) => {
  const styles = props.theme.mode === "light" ? lightStyles : darkStyles;
  const { intlData } = props;
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const configFields = formConfig.fields || [];
  const defaultFieldValues = useMemo(() => {
    const acc = {};
    (configFields || []).forEach((f) => {
      if (f.multiple) {
        acc[f.key] = [];
      } else if (f.type === "text" || f.type === "textarea") {
        acc[f.key] = "";
      } else {
        acc[f.key] = null;
      }
    });
    return acc;
  }, [configFields]);
  const [fieldValues, setFieldValues] = useState(defaultFieldValues);
  
  // Helper function to get field label from config
  const getFieldLabel = (fieldKey) => {
    const field = configFields.find((f) => f.key === fieldKey);
    return field ? field.label : fieldKey;
  };
  // Track open state for each dropdown individually
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [tag, setTag] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // keep defaults in sync if config changes
  useEffect(() => {
    setFieldValues((prev) => {
      const next = { ...prev };
      Object.keys(defaultFieldValues).forEach((k) => {
        if (next[k] === undefined) {
          next[k] = defaultFieldValues[k];
        }
      });
      return next;
    });
  }, [defaultFieldValues]);
  
  const isCaseEmptyValue = useMemo(() => {
    const allFieldsEmpty = Object.values(fieldValues).every((v) => v === null || v === "" || (Array.isArray(v) && v.length === 0));
    const noTypes = selectedTypes.length === 0;
    const noImages = images.length === 0;
    return allFieldsEmpty && noImages && noTypes;
  }, [fieldValues, selectedTypes, images]);

  //Change the back button onpress beahviour and disable swipe back
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            if (!existingCase && !isCaseEmptyValue) {
              setAlertVisibleGoBack(true);
            } else {
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
  }, [navigation, existingCase, isCaseEmptyValue]);
  


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
    
    // Check types field from fieldValues (using config field key)
    const typesFieldValue = fieldValues.types;
    const typesField = configFields.find((f) => f.key === "types");
    const hasTypes = Array.isArray(typesFieldValue) ? typesFieldValue.length > 0 : (typesFieldValue !== null && typesFieldValue !== "");
    
    if (!hasTypes && types.length > 0 && typesField) {
      const fieldLabel = getFieldLabel("types");
      // Use field label from config in the message
      setAlertMessage(`Veuillez sélectionner au moins un ${fieldLabel.toLowerCase()}`);
      setAlertTitle("⚠️");
      setAlertVisibleFieldMissing(true);
      return false;
    }

    // Check all required fields from config
    const requiredFields = configFields.filter((f) => {
      // Fields that are required (sex and age are typically required)
      return f.key === "sex" || f.key === "age";
    });

    for (const field of requiredFields) {
      const value = fieldValues[field.key];
      const isEmpty = value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
      
      if (isEmpty) {
        const fieldLabel = getFieldLabel(field.key);
        let message;
        if (field.type === "icons") {
          // Use specific message for icons if available, otherwise use generic with field label
          const iconMessage = intlData.messages.Case?.[`noIcon${field.key.charAt(0).toUpperCase() + field.key.slice(1)}`];
          if (iconMessage) {
            message = iconMessage;
          } else {
            message = `Veuillez sélectionner un ${fieldLabel.toLowerCase()}`;
          }
        } else {
          message = `Veuillez remplir le champ ${fieldLabel.toLowerCase()}`;
        }
        setAlertMessage(message);
        setAlertTitle("⚠️");
        setAlertVisibleFieldMissing(true);
        return false;
      }
    }

    return true;
};

  const save = () => {
    if (!isCaseComplete()) return;
    const keyValuesObject = { ...fieldValues };
    const imageIDs = images.map((image) => image.id);
    // Use fieldValues.types directly to avoid sync issues
    const typesValue = Array.isArray(fieldValues.types) ? fieldValues.types : (fieldValues.types ? [fieldValues.types] : []);
    const data = {
      id: caseID,
      tag: tag,
      types: typesValue,
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
      handleCreateCase();
      navigation.replace('Home', { notification: true, noCrashCheck: true })
    }
  };

  const submit = async () => {
    if (!isCaseComplete()) return;
    setLoading(true);
    const keyValuesObject = { ...fieldValues };
    const imageIDs = images.map((image) => image.id);
    const coordinates = images.map((image) => ({
      id: image.id,
      latitude: image.lat,
      longitude: image.lng,
    }));
    // Use fieldValues.types directly to avoid sync issues
    const typesValue = Array.isArray(fieldValues.types) ? fieldValues.types : (fieldValues.types ? [fieldValues.types] : []);
    const data = {
      id: caseID,
      tag: tag,
      types: typesValue,
      customField: customField,
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
      setSelectedTypes(mcase.types || []);
      setTag(mcase.tag); // Set tag from existing case
      
      // Dynamically load all fields from config
      const loadedFieldValues = { ...defaultFieldValues };
      configFields.forEach((field) => {
        const fieldKey = field.key;
        if (mcase[fieldKey] !== undefined) {
          // Handle different field types
          if (field.multiple && Array.isArray(mcase[fieldKey])) {
            loadedFieldValues[fieldKey] = mcase[fieldKey];
          } else if (field.multiple) {
            loadedFieldValues[fieldKey] = [];
          } else if (field.type === "text" || field.type === "textarea") {
            loadedFieldValues[fieldKey] = mcase[fieldKey] ?? "";
          } else {
            loadedFieldValues[fieldKey] = mcase[fieldKey] ?? null;
          }
        }
      });
      
      setFieldValues(loadedFieldValues);
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

  // Synchronize selectedTypes with fieldValues.types
  useEffect(() => {
    if (fieldValues.types !== undefined) {
      const typesValue = fieldValues.types;
      if (Array.isArray(typesValue)) {
        setSelectedTypes(typesValue);
      } else if (typesValue !== null && typesValue !== "") {
        setSelectedTypes([typesValue]);
      } else {
        setSelectedTypes([]);
      }
    }
  }, [fieldValues.types]);


  const valuesEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      // For arrays, compare element by element (order matters for DropDownPicker)
      // Use Set for comparison to handle order differences
      const setA = new Set(a);
      const setB = new Set(b);
      if (setA.size !== setB.size) return false;
      for (const item of setA) {
        if (!setB.has(item)) return false;
      }
      return true;
    }
    // Handle case where one is array and other is not
    if (Array.isArray(a) && !Array.isArray(b)) return false;
    if (!Array.isArray(a) && Array.isArray(b)) return false;
    return a === b;
  };

  const setFieldValue = (key, val) => {
    setFieldValues((prev) => {
      const current = prev[key];
      // Always update if it's a different reference for arrays (to preserve order)
      if (Array.isArray(current) && Array.isArray(val)) {
        // Only skip if truly equal (same reference or same content in same order)
        if (current === val) return prev;
        // Check if content is the same
        if (current.length === val.length) {
          let isEqual = true;
          for (let i = 0; i < current.length; i++) {
            if (current[i] !== val[i]) {
              isEqual = false;
              break;
            }
          }
          if (isEqual) return prev;
        }
      } else if (valuesEqual(current, val)) {
        return prev;
      }
      console.log(`Updating field ${key}:`, current, '->', val);
      return { ...prev, [key]: val };
    });
  };


  const renderField = (field) => {
    if (field.type === "icons") {
      const options = (field.options || []).map((opt) => ({
        label: opt.label,
        value: opt.value,
        icon: field.iconSource === "asset"
          ? assetIconMap[opt.icon]
          : (iconPersonalized ? `${iconPath}${opt.value}.png` : opt.icon),
      }));
    
      return (
        <IconSelector
          key={field.key}
          label={field.label}
          options={options}
          value={fieldValues[field.key] ?? null}
          onChange={(val) => setFieldValue(field.key, val)}
          multiple={!!field.multiple}
        />
      );
    }
    if (field.type === "dropdown") {
      let items = [];
      if (Array.isArray(field.options) && field.options.length > 0) {
        items = field.options.map((opt) => ({ label: opt.label, value: opt.value }));
      } else if (field.optionsSource?.type === "redux" && field.optionsSource?.path === "typeAvailable.types") {
        items = types || [];
      }
      
      // Get current value - ensure array for multiple, null/undefined for single
      const fieldValue = fieldValues[field.key];
      const normalizedValue = field.multiple
        ? (Array.isArray(fieldValue) ? fieldValue : [])
        : (fieldValue === undefined || fieldValue === "" ? null : fieldValue);
      
      // Manage open state per field
      const isOpen = openDropdowns[field.key] || false;
      const handleOpen = (open) => {
        setOpenDropdowns(prev => ({ ...prev, [field.key]: open }));
      };
      
      // Simple value change handler - similar to old CasePicker
      const handleValueChange = (val) => {
        console.log(`Picker ${field.key} setting value:`, val);
        setFieldValue(field.key, val);
        // Close dropdown after selection for multiple (like old code)
        if (field.multiple) {
          handleOpen(false);
        }
      };
      
      // Direct setValue handler - like old code
      const handleSetValue = (val) => {
        setFieldValue(field.key, val);
      };
      
      return (
        <ConnectedBasePicker
          key={field.key}
          label={field.label}
          dropdownPlaceholder={field.placeholder}
          emptyText={field.emptyText || intlData.messages.Common?.none || "Aucune option disponible"}
          items={items}
          value={normalizedValue}
          setValue={handleSetValue}
          setItems={() => {}}
          multiple={!!field.multiple}
          mode={field.multiple ? "BADGE" : undefined}
          isOpen={isOpen}
          onOpen={() => handleOpen(true)}
          onClose={() => handleOpen(false)}
          onChangeValue={handleValueChange}
        />
      );
    }
    
    if (field.type === "text" || field.type === "textarea") {
      return (
        <LabeledTextInput
          key={field.key}
          label={field.label}
          placeholder={field.placeholder || field.label}
          value={String(fieldValues[field.key] ?? "")}
          onChangeText={(t) => setFieldValue(field.key, t)}
          multiline={field.type === "textarea"}
          textAlignVertical={field.type === "textarea" ? "top" : undefined}
        />
      );
    }
    return null;
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
            {/* Dynamic fields from config (includes types dropdown via optionsSource) */}
            {configFields.map((f) => renderField(f))}

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