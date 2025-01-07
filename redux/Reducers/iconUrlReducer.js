import {UPDATE_ICON_URL} from "../constants";

const initialState = {
    url: "",
  };
  
const iconUrlReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_ICON_URL":
            return { ...state, url: action.payload };
        default:
            return state;
    }
  };
  
export default iconUrlReducer;
