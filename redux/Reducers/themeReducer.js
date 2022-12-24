import { THEME_CHANGE } from "../constants";

// Handle our action of changing the theme
const themeReducer = (
  state = {
    mode: "light",
  },
  action
) => {
  switch (action.type) {
    case THEME_CHANGE:
      return {
        ...state,
        mode: action.payload,
      };
    default:
      return state;
  }
};

export default themeReducer;
