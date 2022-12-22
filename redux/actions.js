import { THEME_CHANGE } from "./constants";

// switch mode according to what is specified...
export const switchMode = (mode) => {
  return {
    type: THEME_CHANGE,
    payload: mode,
  };
};
