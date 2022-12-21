import React from "react";
import { Icon } from "@rneui/themed";
import { StyleSheet, TouchableOpacity } from "react-native";

class IconButton extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Icon name={this.props.name} size={this.props.size || 30} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});

export default IconButton;
