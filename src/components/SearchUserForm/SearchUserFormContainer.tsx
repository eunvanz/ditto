import React from "react";
import SearchUserForm from "./SearchUserForm";
import useSearchUserFormProps from "./useSearchUserFormProps";

const SearchUserFormContainer = () => {
  const props = useSearchUserFormProps();
  return <SearchUserForm {...props} />;
};

export default SearchUserFormContainer;
