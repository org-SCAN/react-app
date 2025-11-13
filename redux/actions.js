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
  UPDATE_CUSTOM_FIELD,
  UPDATE_EMAIL,
  UPDATE_ICON,
  UPDATE_ICON_URL,
  UPDATE_LOCATION,
  UPDATE_PERMISSION_STATUS,
  UPDATE_TYPE_AVAILABLE,
  UPDATE_TYPE_URL,
  SAVE_ICON_PATH,
  SAVE_CONFIG_TYPE,
  SAVE_CUSTOM_CONFIG_URL,
  UPDATE_FORM_CONFIG
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

export const updateCustomField = (customField) => {
  return {
    type: UPDATE_CUSTOM_FIELD,
    payload: customField,
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

export const updateIcon = (icon) => {
  return {
    type: UPDATE_ICON,
    payload: icon,
  };
}

export const updateIconUrl = (iconUrl) => {
  return{
    type: UPDATE_ICON_URL,
    payload: iconUrl,
  };
}

export const updateLocationCoords = (location) => {
  return {
    type: UPDATE_LOCATION,
    payload: location,
  };
}

export const updatePermissionStatus = (status) => {
  return {
    type: UPDATE_PERMISSION_STATUS,
    payload: status,
  };
}

export const updateTypeAvailable = (types) => {
  return {
    type: UPDATE_TYPE_AVAILABLE,
    payload: types,
  };
};

export const updateTypeUrl = (url) => {
  return {
    type: UPDATE_TYPE_URL,
    payload: url,
  };
}

export const saveIconPath = (iconPath) => ({
  type: SAVE_ICON_PATH,
  payload: iconPath,
});

export const saveConfigType = (configType) => ({
  type: SAVE_CONFIG_TYPE,
  payload: configType,
});

export const saveCustomConfigUrl = (url) => ({
  type: SAVE_CUSTOM_CONFIG_URL,
  payload: url,
});

export const updateFormConfig = (config) => ({
  type: UPDATE_FORM_CONFIG,
  payload: config,
});
