import React, { useEffect, useState } from "react";
import 'intl'; // Importer le polyfill Intl
import 'intl/locale-data/jsonp/fr'; // Importer les données locales en français
import 'intl/locale-data/jsonp/en';

import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";

const formatDate = (date, intlData) => {
  const locale = intlData?.messages?.Pictures?.dateFormat || 'en'; // Locale par défaut
  const options = {
    weekday: 'short',  // Jour de la semaine (ex: "mer.")
    year: 'numeric',   // Année complète (ex: "2024")
    month: 'long',     // Mois complet (ex: "décembre")
    day: 'numeric',    // Jour (ex: "11")
    hour: 'numeric',   // Heure (ex: "11")
    minute: 'numeric', // Minute (ex: "01")
    second: 'numeric', // Seconde (ex: "46")
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
  const { intlData = { messages: { Pictures: { dateFormat: 'en' } } } } = props; // Initialisation par défaut
  const [DATA, setDATA] = useState([]);

  if (props.images && props.images.length > 0) {
    const renderItem = ({ item }) => (
      <Item
        date={item.date}
        uri={item.uri}
        id={item.id}
        caseID={item.caseID}
        coords={item.coords}
        styles={styles}
        intlData={intlData} // Passe intlData à l'item
      />
    );

    useEffect(() => {
      var images = props.images;
      if (props.route.params && props.route.params.caseID) {
        const caseID = props.route.params.caseID;
        images = props.images.filter((image) => image.caseID === caseID);
      }
      const DATA = images.map((image) => {
        return {
          id: image.id,
          caseID: image.caseID,
          date: image.date,
          uri: image.data,
          coords: {
            lat: image.lat,
            lng: image.lng,
          },
        };
      });
      setDATA(DATA);
    }, []);

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
    marginTop: 10,
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
    intlData: state.lang, // Ajout d'intlData à Redux
  };
}

export default connect(mapStateToProps)(Pictures);
