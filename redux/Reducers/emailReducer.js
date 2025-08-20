import { UPDATE_EMAIL } from "../constants";

const initialState = {
  email: ""
};

const emailReducer = (state = { email: null }, action) => {
  switch (action.type) {
    case UPDATE_EMAIL:
      return { ...state, email: action.payload };
    default:
      return state;
  }
};

export default emailReducer;
