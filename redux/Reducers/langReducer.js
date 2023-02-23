import { UPDATE_LANGUAGE } from "../constants";

const setLanguage = (language) => {
  let messages = {};
  switch (language) {
    case "fr":
      messages = Object.assign(messages, require(`../../i18n/fr.json`));
      console.log(messages);
      break;
    default:
    case "en":
      messages = Object.assign(messages, require(`../../i18n/en.json`));
      console.log(messages);
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
