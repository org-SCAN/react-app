import { THEME_CHANGE, STORE_IMAGE, CLEAR_IMAGE } from "./constants";

// switch mode according to what is specified...
export const switchMode = (mode) => {
  return {
    type: THEME_CHANGE,
    payload: mode,
  };
};

export const storeImage = (image) => {
  return {
    type: STORE_IMAGE,
    payload: image,
  };
};

export const clearImage = () => {
  return {
    type: CLEAR_IMAGE,
  };
};
