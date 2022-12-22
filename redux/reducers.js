import { THEME_CHANGE } from "./constants";

// Initially we will have a light mode
const initialState = {
  mode: "light",
};

// Handle our action of changing the theme
const themeReducer = (state = initialState, action) => {
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
