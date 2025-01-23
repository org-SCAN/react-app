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
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import SwipeableItem from "react-native-swipeable-item";
import { connect, useDispatch } from "react-redux";
import CustomAlertTwoButtons from "../components/Case/CustomAlertTwoButtons";
import { THEME_COLOR } from "../theme/constants";
import { deleteImageCase } from "../utils/fileHandler";
import { deleteCase } from "../redux/actions";
import "intl"; 
import "intl/locale-data/jsonp/fr"; 
import "intl/locale-data/jsonp/en";

const formatDate = (date, intlData) => {
  const locale = intlData.messages.Pictures.dateFormat;
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

const ShowCase = (props) => {
  const styles = props.theme.mode === "dark" ? stylesDark : stylesLight;
  const [DATA, setDATA] = useState([]);
  const [cases, setCases] = useState([]);
  const [alertVisibleDelete, setAlertVisibleDelete] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const dispatch = useDispatch();
  const { intlData } = props;

  const handleDelete = async () => {
    if (selectedCase) {
      await deleteImageCase(selectedCase);
      dispatch(deleteCase(selectedCase.id));
      setAlertVisibleDelete(false);
    }
  };

  const Item = ({ id, tag, date, uri, styles, onPress }) => (
    <SwipeableItem
      item={{ id }}
      onSwipeableRightOpen={() => {
        setSelectedCase(props.cases.find((c) => c.id === id));
        setAlertVisibleDelete(true);
      }}
      renderUnderlayRight={() => (
        <View style={styles.deleteContainer}>
          <Pressable
            style={styles.deleteButton}
            onPress={() => {
              setSelectedCase(props.cases.find((c) => c.id === id));
              setAlertVisibleDelete(true);
            }}
          >
            <Icon name="delete" size={30} color="#fff" />
          </Pressable>
        </View>
      )}
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
    </SwipeableItem>
  );

  useEffect(() => {
    const images = props.images;
    const DATA = props.cases.map((caseItem) => ({
      id: caseItem.id,
      tag: caseItem.tag,
      uri: images.find((image) => image.caseID === caseItem.id)?.data,
      date: caseItem.date,
    }));
    setDATA(DATA);
  }, [props.images, props.cases]);

  useEffect(() => {
    setCases(props.cases || []);
  }, [props.cases]);

  if (cases.length > 0) {
    const renderItem = ({ item }) => {
      const onPress = () => {
        props.navigation.navigate("Case", { caseId: item.id });
      };
      return (
        <Item
          id={item.id}
          tag={item.tag}
          date={item.date}
          uri={item.uri}
          styles={styles}
          onPress={onPress}
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
        <Text style={styles.textNoCase}>
          {intlData.messages.consultCases.noCase}
        </Text>
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
