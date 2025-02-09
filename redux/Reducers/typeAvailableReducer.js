import {UPDATE_TYPE_AVAILABLE} from "../constants";
import {UPDATE_TYPE_URL} from "../constants";

const initialState = {
    types: [], // [{ label: "", value: "" }]
    url: "",
  };
  
const typeAvailableReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_TYPE_AVAILABLE:
            return { ...state, types: action.payload };
        case UPDATE_TYPE_URL:
            return { ...state, url: action.payload };
        default:
            return state;
    }
  };
  
export default typeAvailableReducer;
