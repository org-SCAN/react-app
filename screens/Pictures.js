import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { connect } from "react-redux";

const Pictures = (props) => {
  return (
    <View style={styles.mainContent}>
      <Text>{JSON.stringify(props.image)}</Text>
      <Text>{JSON.stringify(props.theme)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

function mapStateToProps(state) {
  return {
    image: state.image,
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(Pictures);
