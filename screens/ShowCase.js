import React, { useEffect, useState, useRef } from "react";
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
import { showConfirmDialog } from "../components/Settings/ConfirmDialog";
import { SCAN_COLOR } from "../theme/constants";
import { deleteImageCase } from "../utils/fileHandler";
import { deleteCase } from "../redux/actions";

const ShowCase = (props) => {
  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;
  const [DATA, setDATA] = useState([]);
  const [cases, setCases] = useState([]);
  const swipeableRef = useRef(null);
  const dispatch = useDispatch();
  const { intlData } = props;
  //disable Touchable opacity when swiping
  const Item = ({ id, tag, date, uri, sex, age, styles, onPress }) => (
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
                showConfirmDialog(
                  intlData.messages.consultCases.clearCase1,
                  intlData.messages.consultCases.clearCase2,
                  async () => {
                    let entireCase = props.cases.find((c) => c.id === id);
                    await deleteImageCase(entireCase);
                    dispatch(deleteCase(id));
                  }
                );
              }}
            >
              <Icon name="delete" size={30} color="#fff" />
            </Pressable>
          </Animated.View>
        );
      }}
      ref={swipeableRef}
    >
      <Pressable style={styles.item} onPress={onPress}>
        <Image style={styles.image} source={{ uri: uri }} blurRadius={100} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.names}>
            {tag}
          </Text>
          <Text style={styles.date}>
            {new Date(date).toLocaleDateString(
              /*"en-GB", comment out to remove multilang problem*/ {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </Text>
          <Text style={styles.hint}>
            {intlData.messages.consultCases.editMessage}
          </Text>
          <Text style={styles.hint}>
            {intlData.messages.consultCases.swipeMessage}
          </Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  useEffect(() => {
    //get first images related to eache cases
    var images = props.images;
    const DATA = props.cases.map((caseItem) => {
      return {
        id: caseItem.id,
        tag: caseItem.tag,
        uri: images.filter((image) => image.caseID === caseItem.id)[0].data,
        date: caseItem.date,
        sex: caseItem.sex,
        age: caseItem.age
        
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

  if (cases.length > 0) {
    const renderItem = ({ item }) => {
      const onPress = () => {
        props.navigation.navigate("Case", { caseId: item.id});
        console.log("le tag passé en param à case est : ", item.tag);
      };
      return (
        <Item
          id={item.id}
          tag={item.tag}
          date={item.date}
          uri={item.uri}
          sex={item.sex}
          age={item.age}
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
  position: {
    flexWrap: "wrap",
    textAlign: "right",
    fontSize: 12,
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
    backgroundColor: SCAN_COLOR,
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
    color: "black",
  },  
  date: {
    ...basicStyles.date,
    color: "black",
  },
  hint: {
    ...basicStyles.hint,
    color: "black",
  },
  position: {
    ...basicStyles.position,
    color: "black",
  },
  id: {
    ...basicStyles.id,
    color: "black",
  },
  textNoCase: {
    ...basicStyles.textNoCase,
    color: "black",
  },
});

const stylesDark = StyleSheet.create({
  ...basicStyles,
  names: {
    ...basicStyles.names,
    color: "white",
  },
  date: {
    ...basicStyles.date,
    color: "white",
  },
  hint: {
    ...basicStyles.hint,
    color: "white",
  },
  position: {
    ...basicStyles.position,
    color: "white",
  },
  id: {
    ...basicStyles.id,
    color: "white",
  },
  textNoCase: {
    ...basicStyles.textNoCase,
    color : "white",
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
