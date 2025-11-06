import React from "react";
import { connect } from "react-redux";
import BasePicker from "./BasePicker";

const ConnectedBasePicker = (props) => {
  const { theme, intlData, ...rest } = props;
  return <BasePicker theme={theme} {...rest} />;
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
    intlData: state.lang,
  };
}

export default connect(mapStateToProps)(ConnectedBasePicker);


