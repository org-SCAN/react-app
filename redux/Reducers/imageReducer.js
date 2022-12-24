import { STORE_IMAGE, CLEAR_IMAGE } from "../constants";

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
    default:
      return state;
  }
};

export default imageReducer;
