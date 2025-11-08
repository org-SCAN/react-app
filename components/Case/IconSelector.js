import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { THEME_COLOR } from "../../theme/constants";

const IconSelector = (props) => {
  const { theme, label, options, value, onChange, multiple = false } = props;
  const styles = theme.mode === "dark" ? stylesDark : stylesLight;

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

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.iconRow}>
        {options.map((opt, idx) => (
          <TouchableOpacity
            key={`${opt.value}-${idx}`}
            style={[styles.iconButton, isSelected(opt) ? styles.iconButtonSelected : null]}
            onPressOut={() => handlePress(opt)}
          >
            <Image source={renderImageSource(opt.icon)} style={styles.icon} />
            {!!opt.label && <Text style={styles.iconText}>{opt.label}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const base = StyleSheet.create({
  container: { marginVertical: 5 },
  label: { fontWeight: "bold", fontSize: 17, marginBottom: 7, marginTop: 7 },
  iconRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  iconButton: { padding: 10, borderRadius: 12, borderWidth: 2, marginHorizontal: 10, alignItems: "center" },
  icon: { width: 56, height: 56, resizeMode: "contain" },
  iconText: { marginTop: 6, fontSize: 12, fontWeight: "600" },
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


