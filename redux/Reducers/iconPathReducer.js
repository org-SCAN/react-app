import {SAVE_ICON_PATH} from "../constants";

const initialState = {
    iconPath: "", // Chaîne vide par défaut (aucun chemin téléchargé)
  };
  
  const iconPathReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_ICON_PATH:
        return {
          ...state,
          iconPath: action.payload, // Mettre à jour le chemin local de l'icône
        };
      default:
        return state;
    }
  };
  
  export default iconPathReducer;
  