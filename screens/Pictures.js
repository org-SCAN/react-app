import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";

const Item = ({ date, uri, id, caseID, coords, styles }) => (
  <View style={styles.item}>
    <Image style={styles.image} source={{ uri: uri }} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.date}>{new Date(date).toUTCString()}</Text>
      <View style={{ flex: 10 }}>
        <Text style={styles.position}>LAT : {JSON.stringify(coords.lat)}</Text>
        <Text style={styles.position}>LNG : {JSON.stringify(coords.lng)}</Text>
      </View>
      <Text style={styles.id}>ID : {id}</Text>
      <Text style={styles.id}>caseID : {caseID}</Text>
    </View>
  </View>
);

const Pictures = (props) => {
  const styles = props.theme.mode === "light" ? lightStyle : darkStyle;
  const [DATA, setDATA] = useState([]);
  if (props.images && props.images.length > 0) {
    const renderItem = ({ item }) => (
      <Item
        date={item.date}
        uri={item.uri}
        id={item.id}
        caseID={item.caseID}
        coords={item.coords}
        styles={styles}
      />
    );

    useEffect(() => {
      var images = props.images;
      if (props.route.params && props.route.params.caseID) {
        const caseID = props.route.params.caseID;
        images = props.images.filter((image) => image.caseID === caseID);
      }
      const DATA = images.map((image) => {
        return {
          id: image.id,
          caseID: image.caseID,
          date: image.date,
          uri: image.data,
          coords: {
            lat: image.lat,
            lng: image.lng,
          },
        };
      });
      setDATA(DATA);
    }, []);

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
        <Text>No images to display</Text>
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
    flex: 1,
    fontSize: 20,
    marginTop: 10,
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
  };
}

export default connect(mapStateToProps)(Pictures);
