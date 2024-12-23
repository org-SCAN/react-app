import {
  THEME_CHANGE,
  STORE_IMAGE,
  CLEAR_IMAGE,
  SAVE_CASE,
  CLEAR_CASE,
  DELETE_CASE,
  EDIT_CASE,
  UPDATE_LANGUAGE,
  UPDATE_USER_ID,
  UPDATE_CASE_NUMBER,
  UPDATE_EMAIL,
} from "./constants";

/* LANGUAGE ACTION */

export const updateLanguage = (language) => {
  return {
    type: UPDATE_LANGUAGE,
    language,
  };
};

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

export const updateUserId = (userId) => {
  return {
    type: UPDATE_USER_ID,
    payload: userId,
  };
};

export const updateCaseNumber = (caseNumber) => {
  return {
    type: UPDATE_CASE_NUMBER,
    payload: caseNumber,
  };
};

export const updateEmail = (email) => {
  return {
    type: UPDATE_EMAIL,
    payload: email,
  };
}