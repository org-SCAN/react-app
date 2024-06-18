import { SET_ICONS } from '../constants';

const initialIconsState = {
  sex: [
    { name: "woman", icon: require("../../icons/woman.png") },
    { name: "man", icon: require("../../icons/man.png") },
    { name: "unknown", icon: require("../../icons/unknown.png") }
  ],
  age: [
    { name: "child", icon: require("../../icons/child.png") },
    { name: "adult", icon: require("../../icons/adult.png") },
    { name: "old", icon: require("../../icons/old.png") }
  ]
};

const iconsReducer = (state = initialIconsState, action) => {
  switch (action.type) {
    case SET_ICONS:
      return {
        ...state,
        [action.payload.key]: action.payload.icons
      };
    default:
      return state;
  }
};

export default iconsReducer