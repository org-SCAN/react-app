import { SET_IDENTIFIER } from '../constants';

const initialState = {
  identifier: '',
};

const identifierReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IDENTIFIER:
      return {
        ...state,
        identifier: action.payload,
      };
    default:
      return state;
  }
};

export default identifierReducer;