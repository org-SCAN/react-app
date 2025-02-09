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
import { Icon } from "@rneui/themed";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { connect, useDispatch } from "react-redux";
import CustomAlertTwoButtons from "../components/Alert/CustomAlertTwoButtons";
import { THEME_COLOR } from "../theme/constants";
import { deleteImageCase } from "../utils/fileHandler";
import { deleteCase } from "../redux/actions";
import 'intl'; // Importer le polyfill Intl
import 'intl/locale-data/jsonp/fr'; // Importer les données locales en français
import 'intl/locale-data/jsonp/en';

const formatDate = (date, intlData) => {
  const locale = intlData.messages.Pictures.dateFormat; 
  const options = {
    year: 'numeric',     
    month: 'numeric',   
    day: 'numeric',     
  };
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

const ShowCase = (props) => {
  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;
  const [DATA, setDATA] = useState([]);
  const [cases, setCases] = useState([]);
  const [alertVisibleDelete, setAlertVisibleDelete] = useState(false); 
  const [selectedCase, setSelectedCase] = useState(null); // Pour garder la trace du cas sélectionné à supprimer
  const dispatch = useDispatch();
  const { intlData } = props;

  // Fonction de suppression du cas
  const handleDelete = async () => {
    if (selectedCase) {
      await deleteImageCase(selectedCase);
      dispatch(deleteCase(selectedCase.id));
      setAlertVisibleDelete(false); 
    }
  };

  // Item à afficher dans la liste
  const Item = ({ id, tag, date, uri, styles, onPress }) => (
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
                // Afficher la confirmation pour supprimer
                setSelectedCase(props.cases.find((c) => c.id === id)); // Sauvegarder le cas sélectionné
                setAlertVisibleDelete(true); // Ouvrir l'alerte de confirmation
              }}
            >
              <Icon name="delete" size={30} color="#fff" />
            </Pressable>
          </Animated.View>
        );
      }}
    >
      <Pressable style={styles.item} onPress={onPress}>
        <Image style={styles.image} source={{ uri: uri }} blurRadius={100} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.names}>{tag}</Text>
          <Text style={styles.date}>{formatDate(date, intlData)}</Text>
          <Text style={styles.hint}>{intlData.messages.consultCases.editMessage}</Text>
          <Text style={styles.hint}>{intlData.messages.consultCases.swipeMessage}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  // Charger les données au montage
  useEffect(() => {
    const images = props.images;
    const DATA = props.cases.map((caseItem) => {
      return {
        id: caseItem.id,
        tag: caseItem.tag,
        uri: images.filter((image) => image.caseID === caseItem.id)[0].data,
        date: caseItem.date,
        sex: caseItem.sex,
        age: caseItem.age,
        description: caseItem.description
      };
    });
    setDATA(DATA);
  }, [props.images, props.cases]);

  useEffect(() => {
    if (props.cases && props.cases.length > 0) {
      setCases(props.cases);
    } else {
      setCases([]);
    }
  }, [props.cases]);

  // Rendu de la liste des éléments
  if (cases.length > 0) {
    const renderItem = ({ item }) => {
      const onPress = () => {
        props.navigation.navigate("Case", { caseId: item.id });
        console.log("le tag passé en param à case est : ", item.tag);
      };
      return (
        <Item
          id={item.id}
          tag={item.tag}
          date={item.date}
          uri={item.uri}
          styles={styles}
          onPress={() => onPress()}
        />
      );
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

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
  image: {
    width: 200,
    height: 200,
  },
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
  names: {
    ...basicStyles.names,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },  
  date: {
    ...basicStyles.date,
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
  },
  hint: {
    ...basicStyles.hint,
    color: THEME_COLOR.LIGHT.TERTIARY_TEXT,
  },
  textNoCase: {
    ...basicStyles.textNoCase,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
});

const stylesDark = StyleSheet.create({
  ...basicStyles,
  names: {
    ...basicStyles.names,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },  
  date: {
    ...basicStyles.date,
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
  },
  hint: {
    ...basicStyles.hint,
    color: THEME_COLOR.DARK.TERTIARY_TEXT,
  },
  textNoCase: {
    ...basicStyles.textNoCase,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
});
function mapStateToProps(state) {
  return {
    images: state.image.image,
    theme: state.theme,
    cases: state.case.cases,
    intlData: state.lang,
    tag: state.tag,
  };
}

export default connect(mapStateToProps)(ShowCase);
