import { UPDATE_LANGUAGE } from "../constants";

const setLanguage = (language) => {
  let messages = {};
  switch (language) {
    case "fr":
      messages = Object.assign(messages, require(`../../i18n/fr.json`));
      break;
    default:
    case "en":
      messages = Object.assign(messages, require(`../../i18n/en.json`));
      break;
    case "es":
      messages = Object.assign(messages, require(`../../i18n/es.json`));
      break;
    case "ar":
      messages = Object.assign(messages, require(`../../i18n/ar.json`));
      break;
  }
  return messages;
};

const initialState = {
  locale: "en",
  messages: setLanguage("en"),
};

const langReducer = (state = initialState, action) => {
  if (action === undefined) return state;
  switch (action.type) {
    case UPDATE_LANGUAGE:
      return {
        locale: action.language,
        messages: setLanguage(action.language),
      };
    default:
      return state;
  }
};
export default langReducer;
