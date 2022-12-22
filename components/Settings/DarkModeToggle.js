import { StyleSheet, View, Text, Switch } from "react-native";
import { useDispatch, connect } from "react-redux";
import { switchMode } from "../../redux/actions";

const DarkModeToggle = (props) => {
  const mainStyle = { ...props.style, ...baseStyles.settingsLine };
  const dispatch = useDispatch();

  // Handle changing the theme mode
  const handleThemeChange = () => {
    dispatch(switchMode(props.theme.mode === "light" ? "dark" : "light"));
  };

  const styles = props.theme.mode == "dark" ? stylesDark : stylesLight;

  return (
    <View style={mainStyle}>
      <View>
        <Text style={styles.mainText}>Dark Mode</Text>
        <Text style={styles.description}>Toggle dark mode</Text>
      </View>
      <View>
        <Switch
          onChange={handleThemeChange}
          value={props.theme.mode == "dark"}
          trackColor={{ true: "#BF0413", false: "grey" }}
        />
      </View>
    </View>
  );
};

const baseStyles = StyleSheet.create({
  settingsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const stylesLight = StyleSheet.create({
  mainText: {
    color: "#000",
    fontSize: 25,
  },
  description: {
    color: "#666",
    fontStyle: "italic",
    fontSize: 17,
  },
});

const stylesDark = StyleSheet.create({
  mainText: {
    color: "#fff",
    fontSize: 25,
  },
  description: {
    color: "#ccc",
    fontStyle: "italic",
    fontSize: 17,
  },
});

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(DarkModeToggle);
