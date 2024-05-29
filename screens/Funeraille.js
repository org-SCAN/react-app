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
import { saveCase, editCase, deleteCase, setIdentifier } from "../redux/actions";
import { HeaderBackButton } from "react-navigation-stack";
import { Alert } from "react-native";
import * as MailComposer from "expo-mail-composer";
import { deleteCameraCache } from "../utils/cacheManager";
import { createZip } from "../utils/fileHandler";
import { deleteImageFromMemory, deleteZip } from "../utils/fileHandler";

const myImage = require('../assets/Enterrement.png');

const Funeraille = (props) => {
  const styles = props.theme.mode === "light" ? lightStyle : darkStyle;
  const { intlData } = props;
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const [existingCase, setExistingCase] = useState(null);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();

  const isCaseComplete = () => {
    if (images.length === 0) {
      alert(intlData.messages.Case.addImage);
      return false;
    }
    return true;
  };

  const save = () => {
    if (!isCaseComplete()) return;
    dispatch(setIdentifier("dead"));
    const imageIDs = images.map((image) => image.id);
    const data = {
      id: caseID,
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
    dispatch(setIdentifier("dead"));
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
      images: imageIDs,
      date: new Date().toISOString(),
      coordinates: coordinates,
    };
    const path = await createZip(data);
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
      const mcase = props.cases.find(
        (item) => item.id === props.route.params.caseId
      );
      setExistingCase(mcase);
      setCaseID(mcase.id);
    } else {
      setCaseID(uuid.v4());
    }
  }, [props.route.params]);

  useEffect(() => {
    setCaseImages();
  }, [props.images, caseID]); 

  const renderItem = ({ item }) => (
    <ScanInput
      placeholder={item.placeholder}
      value={item.value}
      onChangeText={item.onChangeText}
      keyboardType={item.keyboardType}
    />
  );

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
      <View style={styles.pictureButton}>
        <Image 
          onPress={() => navigation.navigate("Camera", { caseID: caseID })}
          activeOpacity={1}
          source={myImage} 
          style={styles.image} 
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
      </View>
      <View style={styles.button}>
        <LittleScanButton
          title={intlData.messages.Case.saveButton}
          onPress={save}
        />
        <LittleScanButton
          title={intlData.messages.Case.submitButton}
          onPress={submit}
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
  pictureButton: {
    width: '60%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '60%',
    height: '20%',
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
    identifier: state.identifier,
  };
}

export default connect(mapStateToProps)(Funeraille);