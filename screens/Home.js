import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Animated } from "react-native";
import ScanButton from "../components/BasicUI/ScanButton";
import { connect } from "react-redux";
import { Icon } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { updateCaseNumber } from "../redux/actions";


const Home = (props) => {
  const navigation = props.navigation;
  const [mOpacity, setOpacity] = useState(new Animated.Value(0));
  const { intlData } = props;

  const dispatch = useDispatch();
  const caseNumber = useSelector(state => state.caseNumber.caseNumber);

  const handleCreateCase = () => {
    dispatch(updateCaseNumber(caseNumber+1));
  };


  useEffect(() => {
    if (props.route.params && props.route.params.notification) {
      setOpacity(new Animated.Value(1));
    }
  }, [props.route.params]);

  useEffect(() => {
    if (mOpacity._value === 1) {
      setTimeout(() => {
        Animated.timing(mOpacity, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      }, 500);
    }
  }, [mOpacity]);

  return (
    <View style={styles.mainContent}>
      <Animated.View
        style={{ ...styles.notification, ...{ opacity: mOpacity } }}
      >
        <Text>{intlData.messages.Home.saveCase} ✅</Text>
      </Animated.View>
      <View style={styles.menu}>
        <ScanButton
          title={intlData.messages.Home.caseButton}
          onPress={() => {
            handleCreateCase();
            navigation.navigate("Case");
          }}
        />
        <ScanButton
          title={intlData.messages.Home.consultButton}
          onPress={() => {
            navigation.navigate("ShowCase");
          }}
        />
        <View style={styles.hintBox}>
          <View style={styles.hintLine}>
            <Icon name="description" size={22} color="grey" />
            <Text style={styles.hintText}> : {props.cases.length}</Text>
          </View>
          <View style={styles.hintLine}>
            <Icon name="camera-alt" size={22} color="grey" />
            <Text style={styles.hintText}> : {props.images.length}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notification: {
    position: "absolute",
    top: 100,
    borderWidth: 1,
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#6FDE7A30",
    borderColor: "#6FDE7A30",
  },
  hintBox: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    width: 200,
  },
  hintLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  hintText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "grey",
  },
});

function mapStateToProps(state) {
  return {
    cases: state.case.cases,
    images: state.image.image,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Home);
