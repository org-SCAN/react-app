import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import themeReducer from "./Reducers/themeReducer";
import imageReducer from "./Reducers/imageReducer";
import caseReducer from "./Reducers/caseReducer";
import langReducer from "./Reducers/langReducer";
// ❌ removed: import caseIdReducer from "./Reducers/caseIdReducer";
import caseNumberReducer from "./Reducers/caseNumberReducer";
import emailReducer from "./Reducers/emailReducer";
import iconReducer from "./Reducers/iconReducer";
import locationReducer from "./Reducers/locationReducer";
import customFieldReducer from "./Reducers/customFieldReducer";
import typeAvailableReducer from "./Reducers/typeAvailableReducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  image: imageReducer,
  case: caseReducer,
  lang: langReducer,
  // ❌ removed: caseId: caseIdReducer,
  caseNumber: caseNumberReducer, // global counter that increments on creation only
  email: emailReducer,
  icon: iconReducer,
  location: locationReducer,
  customField: customFieldReducer,
  typeAvailable: typeAvailableReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default { store, persistor };
