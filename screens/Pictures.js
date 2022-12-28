import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { connect } from "react-redux";

const Pictures = (props) => {
  return (
    <View style={styles.mainContent}>
      {props.images && (
        <Image source={{ uri: props.images[0] }} style={styles.image} />
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
