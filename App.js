import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import MainContent from "./screens/MainContent";
import { PersistGate } from "redux-persist/lib/integration/react";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainContent />
      </PersistGate>
    </Provider>
  );
};

export default App;
