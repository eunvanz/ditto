import React from "react";
import Screen from "./Screen";
import useScreenProps from "./useScreenProps";

const ScreenContainer = () => {
  const props = useScreenProps();
  return <Screen {...props} />;
};

export default ScreenContainer;
