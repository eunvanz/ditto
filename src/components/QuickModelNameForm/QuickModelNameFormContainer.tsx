import React from "react";
import { useDispatch } from "react-redux";
import QuickModelNameForm from "./QuickModelNameForm";

const QuickModelNameFormContainer = () => {
  const dispatch = useDispatch();

  return <QuickModelNameForm />;
};

export default QuickModelNameFormContainer;
