import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./reducers";

export default configureStore({
  reducer: {
    theme: themeReducer,
  },
});
