import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { connect, useDispatch } from "react-redux";
import { deleteCase } from "../redux/actions";
import { showConfirmDialog } from "../components/Settings/ConfirmDialog";

const Item = ({
  date,
  uri,
  id,
  forname,
  lastname,
  styles,
  onPress,
  onLongPress,
}) => (
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    <Image style={styles.image} source={{ uri: uri }} blurRadius={20} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.names}>
        {forname} {lastname}
      </Text>
      <Text style={styles.date}>
        {new Date(date).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
      <Text style={styles.id}>ID : {id}</Text>
    </View>
  </TouchableOpacity>
);

const ShowCase = (props) => {
  const styles = props.theme.mode === "light" ? lightStyle : darkStyle;
  const [DATA, setDATA] = useState([]);
  const [cases, setCases] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    //get first images related to eache cases
    var images = props.images;
    const DATA = props.cases.map((caseItem) => {
      return {
        id: caseItem.id,
        uri: images.filter((image) => image.caseID === caseItem.id)[0].data,
        date: caseItem.date,
        forname: caseItem.forname,
        lastname: caseItem.lastname,
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
        props.navigation.navigate("Case", { caseId: item.id });
      };
      const onLongPress = () =>
        showConfirmDialog(
          "Delete ?",
          `You really want to delete this case with id ? ${item.id}`,
          () => {
            dispatch(deleteCase(item.id));
          }
        );
      return (
        <Item
          date={item.date}
          uri={item.uri}
          id={item.id}
          forname={item.forname}
          lastname={item.lastname}
          styles={styles}
          onPress={() => onPress()}
          onLongPress={() => onLongPress()}
        />
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    );
  } else {
    return (
      <View style={styles.mainContent}>
        <Text>No cases to display</Text>
      </View>
    );
  }
};

const basicStyle = StyleSheet.create({
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
  id: {
    flexWrap: "wrap",
    textAlign: "justify",
    fontStyle: "italic",
    fontSize: 10,
  },
});

const lightStyle = StyleSheet.create({
  ...basicStyle,
  date: {
    ...basicStyle.date,
    color: "black",
  },
  position: {
    ...basicStyle.position,
    color: "black",
  },
  id: {
    ...basicStyle.id,
    color: "black",
  },
});

const darkStyle = StyleSheet.create({
  ...basicStyle,
  date: {
    ...basicStyle.date,
    color: "white",
  },
  position: {
    ...basicStyle.position,
    color: "white",
  },
  id: {
    ...basicStyle.id,
    color: "white",
  },
});

function mapStateToProps(state) {
  return {
    images: state.image.image,
    theme: state.theme,
    cases: state.case.cases,
  };
}

export default connect(mapStateToProps)(ShowCase);
