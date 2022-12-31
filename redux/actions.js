import {
  THEME_CHANGE,
  STORE_IMAGE,
  CLEAR_IMAGE,
  SAVE_CASE,
  CLEAR_CASE,
  DELETE_CASE,
  EDIT_CASE,
} from "./constants";

/* THEME ACTION */
export const switchMode = (mode) => {
  return {
    type: THEME_CHANGE,
    payload: mode,
  };
};

/* IMAGE ACTIONS */
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

/* CASE ACTIONS */
export const saveCase = (caseData) => {
  return {
    type: SAVE_CASE,
    payload: caseData,
  };
};

export const clearCase = () => {
  return {
    type: CLEAR_CASE,
  };
};

export const editCase = (caseData) => {
  return {
    type: EDIT_CASE,
    payload: caseData,
  };
};

export const deleteCase = (id) => {
  return {
    type: DELETE_CASE,
    payload: id,
  };
};
