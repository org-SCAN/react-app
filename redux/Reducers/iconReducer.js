import { UPDATE_ICON } from "../constants";

const initialState = {
  icon: false,
};

const iconReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ICON:
      return { ...state, icon: action.payload };
    default:
      return state;
  }
};

export default iconReducer;
