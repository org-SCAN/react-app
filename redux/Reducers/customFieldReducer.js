import { UPDATE_CUSTOM_FIELD } from "../constants";

const initialState = {
  customField: ""
};

const customFieldReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CUSTOM_FIELD:
      return { ...state, customField: action.payload };
    default:
      return state;
  }
};

export default customFieldReducer;
