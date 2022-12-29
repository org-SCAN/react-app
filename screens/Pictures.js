import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { connect } from "react-redux";

const Pictures = (props) => {
  return (
    <View style={styles.mainContent}>
      {props.images && (
        <View>
          <Image source={{ uri: props.images[0].data }} style={styles.image} />
          <Text>{props.images[0].date}</Text>
          <Text>{props.images[0].id}</Text>
        </View>
      )}
    </View>
  );
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
