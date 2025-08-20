import { UPDATE_USER_ID } from "../constants";

const initialState = {
  userId: ""
};

const userIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_ID:
      return { ...state, userId: action.payload };
    default:
      return state;
  }
};

export default userIdReducer;
