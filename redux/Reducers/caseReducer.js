import { SAVE_CASE, CLEAR_CASE, EDIT_CASE, DELETE_CASE } from "../constants";

const caseReducer = (
  state = {
    cases: [],
  },
  action
) => {
  switch (action.type) {
    case SAVE_CASE:
      return {
        ...state,
        cases: state.cases.concat(action.payload),
      };
    case CLEAR_CASE:
      return {
        ...state,
        case: [],
      };
    case EDIT_CASE:
      return {
        ...state,
        cases: state.cases.map((item) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              ...action.payload,
            };
          }
          return item;
        }),
      };
    case DELETE_CASE:
      return {
        ...state,
        cases: state.cases.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export default caseReducer;
