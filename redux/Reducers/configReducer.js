import { SAVE_CONFIG_TYPE, SAVE_CUSTOM_CONFIG_URL, UPDATE_FORM_CONFIG } from '../constants';
import DefaultConfig from '../../configs/DefaultConfig.json';

const initialState = {
  configType: "default",
  customConfigUrl: "",
  formConfig: DefaultConfig,
};

const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CONFIG_TYPE:
      return {
        ...state,
        configType: action.payload,
      };
    
    case SAVE_CUSTOM_CONFIG_URL:
      return {
        ...state,
        customConfigUrl: action.payload,
      };
    
    case UPDATE_FORM_CONFIG:
      return {
        ...state,
        formConfig: action.payload,
      };
    
    default:
      return state;
  }
};

export default configReducer;