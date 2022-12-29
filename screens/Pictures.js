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

const Item = ({ title, uri }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Image style={styles.image} source={{ uri: uri }} />
  </View>
);

const Pictures = (props) => {
  if (props.images && props.images.length > 0) {
    const renderItem = ({ item }) => <Item title={item.date} uri={item.uri} />;
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

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});

function mapStateToProps(state) {
  return {
    images: state.image.image,
  };
}

export default connect(mapStateToProps)(Pictures);
