import React from "react";
import SearchUserForm from "./SearchUserForm";
import useSearchUserFormProps from "./useSearchUserFormProps";

const SearchUserFormContainer = () => {
  const { project, ...props } = useSearchUserFormProps();
  return project ? <SearchUserForm project={project} {...props} /> : null;
};

export default SearchUserFormContainer;
