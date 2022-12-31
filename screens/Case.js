import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, FlatList } from "react-native";
import ScanInput from "../components/BasicUI/ScanInput";
import ScanButton from "../components/BasicUI/ScanButton";
import uuid from "react-native-uuid";
import { useDispatch } from "react-redux";
import { saveCase } from "../redux/actions";

const FORM = [
  {
    key: "forname",
    placeholder: "Forename",
    value: "",
    onChangeText: null,
    keyboardType: "default",
  },
  {
    key: "lastname",
    placeholder: "Lastname",
    value: "",
    onChangeText: null,
    keyboardType: "default",
  },
  {
    key: "age",
    placeholder: "Age",
    value: "",
    onChangeText: null,
    keyboardType: "numeric",
  },
];

const Case = (props) => {
  const { navigation } = props;
  const [caseID, setCaseID] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setCaseID(uuid.v4());

    return () => {
      //clear form
      FORM.forEach((element) => {
        element.value = "";
        element.onChangeText("");
      });
    };
  }, []);

  FORM.forEach((element) => {
    const [value, onChangeText] = useState(element.value);
    element.value = value;
    element.onChangeText = onChangeText;
  });
  const renderItem = ({ item }) => (
    <ScanInput
      placeholder={item.placeholder}
      value={item.value}
      onChangeText={item.onChangeText}
      keyboardType={item.keyboardType}
    />
  );

  return (
    <SafeAreaView style={styles.mainContent}>
      <FlatList
        data={FORM}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={<View style={{ height: 20 }} />}
        style={{ flexGrow: 0 }}
      />
      <ScanButton
        title="Add photo"
        onPress={() => navigation.navigate("Camera", { caseID: caseID })}
      />
      <ScanButton
        title="Check photos"
        onPress={() => navigation.navigate("Pictures", { caseID: caseID })}
      />
      <View style={styles.button}>
        <ScanButton
          title="Submit"
          onPress={() => {
            console.log(
              "Form with ID : " + caseID + " || data : " + JSON.stringify(FORM)
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    position: "absolute",
    bottom: 0,
  },
});

export default Case;
