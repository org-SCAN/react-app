import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";

const IconSelector = (props) => {
  const { theme, label, options, value, onChange, multiple = false } = props;
  const styles = theme.mode === "dark" ? stylesDark : stylesLight;
  const [rowHeights, setRowHeights] = useState({});

  const handlePress = (opt) => {
    if (!onChange) return;
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(opt.value);
      onChange(exists ? current.filter((v) => v !== opt.value) : [...current, opt.value]);
    } else {
      onChange(value === opt.value ? null : opt.value);
    }
  };

  const isSelected = (opt) => (multiple ? Array.isArray(value) && value.includes(opt.value) : value === opt.value);

  const renderImageSource = (icon) => (typeof icon === "string" ? { uri: icon } : icon);

  // Regrouper les options par lignes de 3
  const groupedOptions = [];
  for (let i = 0; i < options.length; i += 3) {
    groupedOptions.push(options.slice(i, i + 3));
  }

  // Gérer la mesure de hauteur pour chaque ligne
  const handleLayout = (event, rowIndex, itemIndex) => {
    const { height } = event.nativeEvent.layout;
    
    setRowHeights((prev) => {
      const currentRowHeights = prev[rowIndex] || [];
      const newRowHeights = [...currentRowHeights];
      newRowHeights[itemIndex] = height;
      
      return {
        ...prev,
        [rowIndex]: newRowHeights,
      };
    });
  };

  // Obtenir la hauteur maximale pour une ligne donnée
  const getMaxHeightForRow = (rowIndex) => {
    const heights = rowHeights[rowIndex];
    if (!heights || heights.length === 0) return undefined;
    return Math.max(...heights);
  };

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.iconContainer}>
        {groupedOptions.map((row, rowIndex) => {
          const maxHeight = getMaxHeightForRow(rowIndex);
          
          return (
            <View key={`row-${rowIndex}`} style={styles.iconRow}>
              {row.map((opt, itemIndex) => (
                <View
                  key={`${opt.value}-${itemIndex}`}
                  style={styles.iconButtonWrapper}
                >
                  <TouchableOpacity
                    style={[
                      styles.iconButton,
                      isSelected(opt) ? styles.iconButtonSelected : null,
                      maxHeight ? { height: maxHeight } : null,
                    ]}
                    onPressOut={() => handlePress(opt)}
                    onLayout={(event) => handleLayout(event, rowIndex, itemIndex)}
                  >
                    <Image source={renderImageSource(opt.icon)} style={styles.icon} />
                    {!!opt.label && <Text style={styles.iconText}>{opt.label}</Text>}
                  </TouchableOpacity>
                </View>
              ))}
              {/* Ajouter des espaces vides pour compléter la ligne si < 3 icônes */}
              {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, idx) => (
                <View key={`empty-${idx}`} style={styles.iconButtonWrapper} />
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const base = StyleSheet.create({
  container: { marginVertical: 5 },
  label: { fontWeight: "bold", fontSize: 17, marginBottom: 7, marginTop: 7 },
  iconContainer: { 
    flexDirection: "column",
  },
  iconRow: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    justifyContent: "center",
  },
  iconButtonWrapper: {
    width: "30%",
    marginHorizontal: "1.5%",
    marginVertical: "1.5%",
  },
  iconButton: { 
    padding: 10, 
    borderRadius: 12, 
    borderWidth: 2, 
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  icon: { width: 56, height: 56, resizeMode: "contain" },
  iconText: { 
    marginTop: 6, 
    fontSize: 12, 
    fontWeight: "600",
    textAlign: "center",
  },
});

const stylesLight = StyleSheet.create({
  ...base,
  label: { ...base.label, color: THEME_COLOR.LIGHT.MAIN_TEXT },
  iconButton: { ...base.iconButton, borderColor: THEME_COLOR.LIGHT.INPUT, backgroundColor: THEME_COLOR.LIGHT.INPUT },
  iconButtonSelected: { backgroundColor: THEME_COLOR.LIGHT.ICON_SELECTED, borderColor: THEME_COLOR.LIGHT.ICON_SELECTED },
  iconText: { ...base.iconText, color: THEME_COLOR.LIGHT.MAIN_TEXT },
});

const stylesDark = StyleSheet.create({
  ...base,
  label: { ...base.label, color: THEME_COLOR.DARK.MAIN_TEXT },
  iconButton: { ...base.iconButton, borderColor: THEME_COLOR.DARK.INPUT, backgroundColor: THEME_COLOR.DARK.INPUT },
  iconButtonSelected: { backgroundColor: THEME_COLOR.DARK.ICON_SELECTED, borderColor: THEME_COLOR.DARK.ICON_SELECTED },
  iconText: { ...base.iconText, color: THEME_COLOR.DARK.MAIN_TEXT },
});

function mapStateToProps(state) {
  return { theme: state.theme };
}

export default connect(mapStateToProps)(IconSelector);