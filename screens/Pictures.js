import React, { useEffect, useState } from "react";
import 'intl';
import 'intl/locale-data/jsonp/fr';
import 'intl/locale-data/jsonp/en';
import { THEME_COLOR } from "../theme/constants";
import { ScrollView } from "react-native";

import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";

const formatDate = (date, intlData) => {
  const locale = intlData?.messages?.Pictures?.dateFormat || 'en';
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

const Item = ({ date, uri, id, caseID, coords, styles, intlData }) => (
  <View style={styles.item}>
    <Image style={styles.image} source={{ uri: uri }} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.date}>
        {formatDate(date, intlData)}
      </Text>
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
  const { intlData = { messages: { Pictures: { dateFormat: 'en' } } } } = props;
  const [DATA, setDATA] = useState([]);

  useEffect(() => {
    let images = props.images;
    if (props.route.params && props.route.params.caseID) {
      const caseID = props.route.params.caseID;
      images = props.images.filter((image) => image.caseID === caseID);
    }
    const formattedData = images.map((image) => ({
      id: image.id,
      caseID: image.caseID,
      date: image.date,
      uri: image.data,
      coords: {
        lat: image.lat,
        lng: image.lng,
      },
    }));
    setDATA(formattedData);
  }, [props.images, props.route.params]);

  return (
    <ScrollView style={styles.scrollViewContent}>
      {DATA.map((item) => (
        <Item
          key={item.id}
          date={item.date}
          uri={item.uri}
          id={item.id}
          caseID={item.caseID}
          coords={item.coords}
          styles={styles}
          intlData={intlData}
        />
      ))}
    </ScrollView>
  );
};

const basicStyle = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    padding: 5,
  },
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
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  date: {
    flexWrap: "wrap",
    textAlign: "right",
    flex: 1,
    fontSize: 20,
  },
  position: {
    flexWrap: "wrap",
    textAlign: "right",
    fontSize: 12,
  },
  id: {
    flexWrap: "wrap",
    fontStyle: "italic",
    fontSize: 10,
  },
});

const lightStyle = StyleSheet.create({
  ...basicStyle,
  date: {
    ...basicStyle.date,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  position: {
    ...basicStyle.position,
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
  },
  id: {
    ...basicStyle.id,
    color: THEME_COLOR.LIGHT.TERTIARY_TEXT,
  },
});

const darkStyle = StyleSheet.create({
  ...basicStyle,
  date: {
    ...basicStyle.date,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  position: {
    ...basicStyle.position,
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
  },
  id: {
    ...basicStyle.id,
    color: THEME_COLOR.DARK.TERTIARY_TEXT,
  },
});

function mapStateToProps(state) {
  return {
    images: state.image.image,
    theme: state.theme,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(Pictures);
