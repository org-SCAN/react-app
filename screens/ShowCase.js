import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { connect, useDispatch } from "react-redux";
import CustomAlertTwoButtons from "../components/Alert/CustomAlertTwoButtons";
import { THEME_COLOR } from "../theme/constants";
import { deleteImageCase } from "../utils/fileHandler";
import { deleteCase } from "../redux/actions";
import "intl";
import "intl/locale-data/jsonp/fr";
import "intl/locale-data/jsonp/en";

const formatDate = (date, intlData) => {
  const locale = intlData.messages.Pictures.dateFormat;
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

const ShowCase = (props) => {
  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;
  const [DATA, setDATA] = useState([]);
  const [cases, setCases] = useState([]);
  const [alertVisibleDelete, setAlertVisibleDelete] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const dispatch = useDispatch();
  const { intlData } = props;

  // Suppression du cas (images + case)
  const handleDelete = async () => {
    if (selectedCase) {
      await deleteImageCase(selectedCase); // suppose un objet case ; ok si ta util le gère
      dispatch(deleteCase(selectedCase.id)); // UUID technique
      setAlertVisibleDelete(false);
    }
  };

  // Item de liste
  const Item = ({ id, caseID, date, uri, styles, onPress }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => {
        const opacity = dragX.interpolate({
          inputRange: [-120, 0],
          outputRange: [1, 0],
          extrapolate: "clamp",
        });
        return (
          <Animated.View style={{ ...styles.deleteContainer, opacity }}>
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                const found = props.cases.find((c) => c.id === id);
                setSelectedCase(found || null);
                setAlertVisibleDelete(true);
              }}
            >
              <MaterialIcons name="delete" size={30} color="#fff" />
            </Pressable>
          </Animated.View>
        );
      }}
    >
      <Pressable style={styles.item} onPress={onPress}>
        {!!uri && <Image style={styles.image} source={{ uri }} blurRadius={100} />}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.names}>{caseID || "(sans identifiant)"}</Text>
          <Text style={styles.date}>{formatDate(date, intlData)}</Text>
          <Text style={styles.hint}>{intlData.messages.consultCases.editMessage}</Text>
          <Text style={styles.hint}>{intlData.messages.consultCases.swipeMessage}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  // Charger les données (construit un dataset prêt pour FlatList)
  useEffect(() => {
    const images = props.images || [];
    const dataset = (props.cases || []).map((caseItem) => {
      // L’UUID technique (caseItem.id) lie les images: image.caseID === caseItem.id
      const firstImage = images.find((image) => image.caseID === caseItem.id);
      return {
        id: caseItem.id,                 // UUID technique
        caseID: caseItem.caseID || "",   // étiquette visible (saisie)
        uri: firstImage?.data,           // peut être undefined s’il n’y a pas d’image
        date: caseItem.date,
        sex: caseItem.sex,
        age: caseItem.age,
        description: caseItem.description,
      };
    });
    setDATA(dataset);
  }, [props.images, props.cases]);

  useEffect(() => {
    setCases(props.cases && props.cases.length > 0 ? props.cases : []);
  }, [props.cases]);

  if (cases.length > 0) {
    const renderItem = ({ item }) => {
      const onPress = () => {
        // Ouvre l’écran d’édition du cas via son UUID
        props.navigation.navigate("Case", { caseId: item.id });
      };
      return (
        <Item
          id={item.id}
          caseID={item.caseID}
          date={item.date}
          uri={item.uri}
          styles={styles}
          onPress={onPress}
        />
      );
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <FlatList data={DATA} renderItem={renderItem} keyExtractor={(item) => item.id} />

        <CustomAlertTwoButtons
          visible={alertVisibleDelete}
          title="⚠️"
          message={intlData.messages.consultCases.clearCase2}
          onConfirm={handleDelete}
          onCancel={() => setAlertVisibleDelete(false)}
          confirmButtonText={intlData.messages.yes}
          cancelButtonText={intlData.messages.no}
        />
      </GestureHandlerRootView>
    );
  } else {
    return (
      <View style={styles.mainContent}>
        <Text style={styles.textNoCase}>{intlData.messages.consultCases.noCase}</Text>
      </View>
    );
  }
};

const basicStyles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 200, height: 200 },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  date: {
    flexWrap: "wrap",
    textAlign: "right",
    flex: 10,
    fontSize: 17,
  },
  names: {
    flexWrap: "wrap",
    textAlign: "right",
    flex: 1,
    fontSize: 25,
    fontWeight: "bold",
  },
  hint: {
    flexWrap: "wrap",
    textAlign: "justify",
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "right",
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    backgroundColor: THEME_COLOR.SCAN,
  },
  deleteButton: {
    width: 120,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textNoCase: {
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
});

const stylesLight = StyleSheet.create({
  ...basicStyles,
  names: { ...basicStyles.names, color: THEME_COLOR.LIGHT.MAIN_TEXT },
  date: { ...basicStyles.date, color: THEME_COLOR.LIGHT.SECONDARY_TEXT },
  hint: { ...basicStyles.hint, color: THEME_COLOR.LIGHT.TERTIARY_TEXT },
  textNoCase: { ...basicStyles.textNoCase, color: THEME_COLOR.LIGHT.MAIN_TEXT },
});

const stylesDark = StyleSheet.create({
  ...basicStyles,
  names: { ...basicStyles.names, color: THEME_COLOR.DARK.MAIN_TEXT },
  date: { ...basicStyles.date, color: THEME_COLOR.DARK.SECONDARY_TEXT },
  hint: { ...basicStyles.hint, color: THEME_COLOR.DARK.TERTIARY_TEXT },
  textNoCase: { ...basicStyles.textNoCase, color: THEME_COLOR.DARK.MAIN_TEXT },
});

function mapStateToProps(state) {
  return {
    images: state.image.image,
    theme: state.theme,
    cases: state.case.cases,
    intlData: state.lang,
    // tag: state.tag, // ❌ plus utilisé ici
  };
}

export default connect(mapStateToProps)(ShowCase);
