import { UPDATE_LOCATION, UPDATE_PERMISSION_STATUS } from "../constants";

const initialState = {
  coords: { latitude: 0, longitude: 0 },
  permissionStatus: null,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_LOCATION:
      return { ...state, coords: action.payload };
    case UPDATE_PERMISSION_STATUS:
      return { ...state, permissionStatus: action.payload };
    default:
      return state;
  }
};

export default locationReducer;
