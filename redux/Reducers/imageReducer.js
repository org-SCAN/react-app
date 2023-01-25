import { STORE_IMAGE, CLEAR_IMAGE, DELETE_CASE } from "../constants";

const imageReducer = (
  state = {
    image: [],
  },
  action
) => {
  switch (action.type) {
    case STORE_IMAGE:
      return {
        ...state,
        image: state.image.concat(action.payload),
      };
    case CLEAR_IMAGE:
      return {
        ...state,
        image: [],
      };
    case DELETE_CASE:
      return {
        ...state,
        image: state.image.filter((item) => item.caseID !== action.payload),
      };
    default:
      return state;
  }
};

export default imageReducer;
