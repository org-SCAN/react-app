import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";

const Item = ({ date, uri, id, styles }) => (
  <View style={styles.item}>
    <Image style={styles.image} source={{ uri: uri }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.date}>{new Date(date).toUTCString()}</Text>
      <Text style={styles.position}>Somewhere in Niévroz</Text>
      <Text style={styles.id}>ID : {id}</Text>
    </View>
  </View>
);

const Pictures = (props) => {
  const styles = props.theme.mode === "light" ? lightStyle : darkStyle;
  if (props.images && props.images.length > 0) {
    const renderItem = ({ item }) => (
      <Item date={item.date} uri={item.uri} id={item.id} styles={styles} />
    );
    const DATA = props.images.map((image) => {
      return {
        id: image.id,
        date: image.date,
        uri: image.data,
      };
    });

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
    marginLeft: 10,
    marginTop: 10,
  },
  position: {
    flexWrap: "wrap",
    textAlign: "right",
    flex: 10,
  },
  id: {
    flexWrap: "wrap",
    textAlign: "right",
    marginLeft: 10,
    fontStyle: "italic",
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
