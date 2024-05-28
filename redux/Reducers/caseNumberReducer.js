import { UPDATE_CASE_NUMBER } from "../constants";

const initialState = {
  caseNumber: 1
};

const caseNumberReducer = (state = { caseNumber: null }, action) => {
  switch (action.type) {
    case UPDATE_CASE_NUMBER:
      return { ...state, caseNumber: action.payload };
    default:
      return state;
  }
};

export default caseNumberReducer;
