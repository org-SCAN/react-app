import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import MainContent from "./MainContent";

const App = () => {
  return (
    <Provider store={store}>
      <MainContent />
    </Provider>
  );
};

export default App;
