import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Animated,
  ActivityIndicator,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { connect, useDispatch } from "react-redux";
import CustomAlertTwoButtons from "../components/Alert/CustomAlertTwoButtons";
import CustomAlert from "../components/Alert/CustomAlert";
import { THEME_COLOR } from "../theme/constants";
import { deleteImageCase } from "../utils/fileHandler";
import { deleteCase } from "../redux/actions";
import {
  createTemporaryExport,
  deleteAllExports,
  getExportStatus,
  getRemainingTimeFormatted,
} from "../utils/temporaryExportManager";
import 'intl';
import 'intl/locale-data/jsonp/fr';
import 'intl/locale-data/jsonp/en';

const formatDate = (date, intlData) => {
  const locale = intlData.messages.Pictures.dateFormat; 
  const options = {
    year: 'numeric',     
    month: 'numeric',   
    day: 'numeric',     
  };
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

const ShowCase = (props) => {
  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;
  const [DATA, setDATA] = useState([]);
  const [cases, setCases] = useState([]);
  const [alertVisibleDelete, setAlertVisibleDelete] = useState(false); 
  const [selectedCase, setSelectedCase] = useState(null);
  
  // États pour l'export
  const [loading, setLoading] = useState(false);
  const [exportProgress, setExportProgress] = useState({ current: 0, total: 0 });
  const [exportStatus, setExportStatus] = useState({
    active: false,
    expiresAt: null,
    remainingTime: 0,
    path: null,
    files: [],
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [confirmDeleteExportVisible, setConfirmDeleteExportVisible] = useState(false);
  
  const dispatch = useDispatch();
  const { intlData } = props;

  // Vérifier le statut de l'export au montage et toutes les secondes
  useEffect(() => {
    checkExportStatus();
    const interval = setInterval(checkExportStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkExportStatus = async () => {
    const status = await getExportStatus();
    setExportStatus(status);
  };

  // Fonction de suppression du cas
  const handleDelete = async () => {
    if (selectedCase) {
      await deleteImageCase(selectedCase);
      dispatch(deleteCase(selectedCase.id));
      setAlertVisibleDelete(false); 
    }
  };

  // Fonction d'export
  const handleExport = async () => {
    if (cases.length === 0) {
      setAlertTitle('⚠️');
      setAlertMessage(
        intlData.messages.Settings?.noDataToExport || 
        'Aucun cas à exporter'
      );
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    setExportProgress({ current: 0, total: cases.length });

    try {
      const result = await createTemporaryExport(
        cases, 
        props.images,
        (current, total) => {
          setExportProgress({ current, total });
        }
      );
      
      setAlertTitle('✅');
      const messageTemplate = Platform.OS === 'android'
        ? intlData.messages.Settings?.exportSuccessAndroid || '{count} cases successfully exported.\n\nFiles are available in the selected folder.\n\nExpires in 30 minutes.'
        : intlData.messages.Settings?.exportSuccessIOS || '{count} cases successfully exported.\n\nAccess via iTunes/Finder:\n1. Connect your iPhone to Mac/PC\n2. Open Finder (Mac) or iTunes (PC)\n3. Select your iPhone\n4. Go to "Files" > "Divi"\n5. Download the TempExport folder\n\nExpires in 30 minutes.';
      
      const message = messageTemplate.replace('{count}', result.count);
      setAlertMessage(message);
      setAlertVisible(true);
      await checkExportStatus();
    } catch (error) {
      console.error('Export error:', error);
      setAlertTitle('❌');
      setAlertMessage(
        intlData.messages.Settings?.exportError || 
        'Erreur lors de l\'export'
      );
      setAlertVisible(true);
    } finally {
      setLoading(false);
      setExportProgress({ current: 0, total: 0 });
    }
  };

  const handleDeleteExport = async () => {
    setLoading(true);
    try {
      await deleteAllExports();
      setAlertTitle('✅');
      setAlertMessage(
        intlData.messages.Settings?.exportDeletedSuccess || 
        'Export supprimé avec succès'
      );
      setAlertVisible(true);
      await checkExportStatus();
    } catch (error) {
      setAlertTitle('❌');
      setAlertMessage(
        intlData.messages.Settings?.exportDeleteError || 
        'Erreur lors de la suppression'
      );
      setAlertVisible(true);
    } finally {
      setLoading(false);
      setConfirmDeleteExportVisible(false);
    }
  };

  // Item à afficher dans la liste
  const Item = ({ id, tag, date, uri, styles, onPress }) => (
    <Swipeable
      renderRightActions={(progress, dragX) => {
        const opacity = dragX.interpolate({
          inputRange: [-120, 0],
          outputRange: [1, 0],
          extrapolate: "clamp",
        });
        return (
          <Animated.View style={{ ...styles.deleteContainer, opacity }}>
            <Pressable
              style={styles.deleteButton}
              onPress={() => {
                setSelectedCase(props.cases.find((c) => c.id === id));
                setAlertVisibleDelete(true);
              }}
            >
              <MaterialIcons name="delete" size={30} color="#fff" />
            </Pressable>
          </Animated.View>
        );
      }}
    >
      <Pressable style={styles.item} onPress={onPress}>
        <Image style={styles.image} source={{ uri: uri }} blurRadius={100} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.names}>{tag}</Text>
          <Text style={styles.date}>{formatDate(date, intlData)}</Text>
          <Text style={styles.hint}>{intlData.messages.consultCases.editMessage}</Text>
          <Text style={styles.hint}>{intlData.messages.consultCases.swipeMessage}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );

  // Charger les données au montage
  useEffect(() => {
    const images = props.images;
    const DATA = props.cases.map((caseItem) => {
      return {
        id: caseItem.id,
        tag: caseItem.tag,
        uri: images.filter((image) => image.caseID === caseItem.id)[0].data,
        date: caseItem.date,
        sex: caseItem.sex,
        age: caseItem.age,
        description: caseItem.description
      };
    });
    setDATA(DATA);
  }, [props.images, props.cases]);

  useEffect(() => {
    if (props.cases && props.cases.length > 0) {
      setCases(props.cases);
    } else {
      setCases([]);
    }
  }, [props.cases]);

  // En-tête avec boutons d'export
  const ListHeaderComponent = () => {
    if (cases.length === 0) return null;
    
    return (
      <View style={styles.exportHeader}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="white" />
            {exportProgress.total > 0 && (
              <Text style={styles.progressText}>
                {intlData.messages.Settings?.exportingProgress || 'Export en cours'}: {exportProgress.current} / {exportProgress.total}
              </Text>
            )}
          </View>
        )}

        <Text style={styles.exportTitle}>
          {intlData.messages.Settings?.temporaryExportTitle || 'Export temporaire (USB)'}
        </Text>

        {exportStatus.active ? (
          <View style={styles.exportStatusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusActive}>
                {intlData.messages.Settings?.exportActive || 'Export actif'}
              </Text>
              <Text style={styles.statusTimer}>
                ⏱️ {getRemainingTimeFormatted(exportStatus.remainingTime)}
              </Text>
            </View>
            <Text style={styles.statusDetails}>
              {exportStatus.files.length} {intlData.messages.Settings?.filesExported || 'fichier(s) exporté(s)'}
            </Text>
            
            <Pressable 
              style={styles.deleteExportButton} 
              onPress={() => setConfirmDeleteExportVisible(true)}
            >
              <MaterialIcons name="delete" size={20} color="#fff" />
              <Text style={styles.exportButtonText}>
                {intlData.messages.Settings?.deleteExport || 'Supprimer l\'export'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.exportButton} onPress={handleExport}>
            <MaterialIcons name="file-download" size={20} color="#fff" />
            <Text style={styles.exportButtonText}>
              {intlData.messages.Settings?.exportAllCases || `Exporter tous les cas`} ({cases.length})
            </Text>
          </Pressable>
        )}

        <View style={styles.separator} />
      </View>
    );
  };

  // Rendu de la liste des éléments
  if (cases.length > 0) {
    const renderItem = ({ item }) => {
      const onPress = () => {
        props.navigation.navigate("Case", { caseId: item.id });
        console.log("le tag passé en param à case est : ", item.tag);
      };
      return (
        <Item
          id={item.id}
          tag={item.tag}
          date={item.date}
          uri={item.uri}
          styles={styles}
          onPress={() => onPress()}
        />
      );
    };

    return (
      <GestureHandlerRootView style={styles.container}>
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeaderComponent}
        />

        <CustomAlertTwoButtons
          visible={alertVisibleDelete}
          title="⚠️"
          message={intlData.messages.consultCases.clearCase2}
          onConfirm={handleDelete}
          onCancel={() => setAlertVisibleDelete(false)}
          confirmButtonText={intlData.messages.yes}
          cancelButtonText={intlData.messages.no}
        />

        <CustomAlertTwoButtons
          visible={confirmDeleteExportVisible}
          title="⚠️"
          message={
            intlData.messages.Settings?.confirmDeleteExport}
          onConfirm={handleDeleteExport}
          onCancel={() => setConfirmDeleteExportVisible(false)}
          confirmButtonText={intlData.messages.yes || 'Oui'}
          cancelButtonText={intlData.messages.no || 'Non'}
        />

        <CustomAlert
          title={alertTitle}
          message={alertMessage}
          onConfirm={() => setAlertVisible(false)}
          visible={alertVisible}
        />
      </GestureHandlerRootView>
    );
  } else {
    return (
      <View style={styles.mainContent}>
        <Text style={styles.textNoCase}>{intlData.messages.consultCases.noCase}</Text>
      </View>
    );
  }
};

const basicStyles = StyleSheet.create({
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
    flex: 10,
    fontSize: 17,
  },
  names: {
    flexWrap: "wrap",
    textAlign: "right",
    flex: 1,
    fontSize: 25,
    fontWeight: "bold",
  },
  hint: {
    flexWrap: "wrap",
    textAlign: "justify",
    fontStyle: "italic",
    fontSize: 12,
    textAlign: "right",
  },
  deleteContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    backgroundColor: THEME_COLOR.SCAN,
  },
  deleteButton: {
    width: 120,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textNoCase: {
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "center",
    alignItems: "center",
  },
  exportHeader: {
    padding: 15,
    marginBottom: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 10,
  },
  progressText: {
    color: 'white',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  exportStatusContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusActive: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusTimer: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusDetails: {
    fontSize: 13,
    marginBottom: 10,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME_COLOR.SCAN,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  deleteExportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginTop: 15,
    opacity: 0.3,
  },
});

const stylesLight = StyleSheet.create({
  ...basicStyles,
  names: {
    ...basicStyles.names,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },  
  date: {
    ...basicStyles.date,
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
  },
  hint: {
    ...basicStyles.hint,
    color: THEME_COLOR.LIGHT.TERTIARY_TEXT,
  },
  textNoCase: {
    ...basicStyles.textNoCase,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  exportTitle: {
    ...basicStyles.exportTitle,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  exportStatusContainer: {
    ...basicStyles.exportStatusContainer,
    backgroundColor: THEME_COLOR.LIGHT.INPUT,
    borderColor: THEME_COLOR.LIGHT.BUTTON_BORDER,
  },
  statusActive: {
    ...basicStyles.statusActive,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  statusTimer: {
    ...basicStyles.statusTimer,
    color: THEME_COLOR.LIGHT.MAIN_TEXT,
  },
  statusDetails: {
    ...basicStyles.statusDetails,
    color: THEME_COLOR.LIGHT.SECONDARY_TEXT,
  },
  separator: {
    ...basicStyles.separator,
    backgroundColor: THEME_COLOR.LIGHT.BUTTON_BORDER,
  },
});

const stylesDark = StyleSheet.create({
  ...basicStyles,
  names: {
    ...basicStyles.names,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },  
  date: {
    ...basicStyles.date,
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
  },
  hint: {
    ...basicStyles.hint,
    color: THEME_COLOR.DARK.TERTIARY_TEXT,
  },
  textNoCase: {
    ...basicStyles.textNoCase,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  exportTitle: {
    ...basicStyles.exportTitle,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  exportStatusContainer: {
    ...basicStyles.exportStatusContainer,
    backgroundColor: THEME_COLOR.DARK.INPUT,
    borderColor: THEME_COLOR.DARK.BUTTON_BORDER,
  },
  statusActive: {
    ...basicStyles.statusActive,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  statusTimer: {
    ...basicStyles.statusTimer,
    color: THEME_COLOR.DARK.MAIN_TEXT,
  },
  statusDetails: {
    ...basicStyles.statusDetails,
    color: THEME_COLOR.DARK.SECONDARY_TEXT,
  },
  separator: {
    ...basicStyles.separator,
    backgroundColor: THEME_COLOR.DARK.BUTTON_BORDER,
  },
});

function mapStateToProps(state) {
  return {
    images: state.image.image,
    theme: state.theme,
    cases: state.case.cases,
    intlData: state.lang,
    tag: state.tag,
  };
}

export default connect(mapStateToProps)(ShowCase);