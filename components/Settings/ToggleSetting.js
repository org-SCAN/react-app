import React from "react";
import { StyleSheet, View, Text, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ToggleSetting extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.storageKey === undefined) {
      throw new Error("storageKey prop is required");
    }
    this.state = {
      toggled: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(this.props.storageKey)
      .then((value) => {
        if (value) {
          this.setState({ toggled: value === "true" });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    AsyncStorage.setItem(
      this.props.storageKey,
      JSON.stringify(this.state.toggled)
    ).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const mainStyle = { ...this.props.style, ...styles.settingsLine };
    return (
      <View style={mainStyle}>
        <View>
          <Text style={styles.mainText}>{this.props.title || "default"}</Text>
          <Text style={styles.description}>
            {this.props.description || "undefined"}
          </Text>
        </View>
        <View>
          <Switch
            onValueChange={(value) => this.setState({ toggled: value })}
            value={this.state.toggled}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainText: {
    fontSize: 25,
  },
  description: {
    fontStyle: "italic",
    color: "#666",
    fontSize: 17,
  },
  settingsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ToggleSetting;
