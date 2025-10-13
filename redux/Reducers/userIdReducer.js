import { UPDATE_CASE_ID } from "../constants";

const initialState = {
  caseId: ""
};

const caseIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CASE_ID:
      return { ...state, caseId: action.payload };
    default:
      return state;
  }
};

export default caseIdReducer;
