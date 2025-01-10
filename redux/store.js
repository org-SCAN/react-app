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
import userIdReducer from "./Reducers/userIdReducer";
import caseNumberReducer from "./Reducers/caseNumberReducer";
import emailReducer from "./Reducers/emailReducer";
import iconUrlReducer from "./Reducers/iconUrlReducer";
import iconPathReducer from "./Reducers/iconPathReducer";
import iconReducer from "./Reducers/iconReducer";

const rootReducer = combineReducers({
  theme: themeReducer,
  image: imageReducer,
  case: caseReducer,
  lang: langReducer,
  userId: userIdReducer,
  caseNumber: caseNumberReducer,
  email: emailReducer,
  icon: iconReducer,
  iconUrl: iconUrlReducer,
  iconPath: iconPathReducer,
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
