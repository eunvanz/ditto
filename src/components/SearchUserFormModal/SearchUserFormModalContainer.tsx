import React from "react";
import SearchUserFormModal from "./SearchUserFormModal";
import useSearchUserFormModalProps from "./useSearchUserFormModalProps";

const SearchUserFormModalContainer = () => {
  const props = useSearchUserFormModalProps();
  return <SearchUserFormModal {...props} />;
};

export default SearchUserFormModalContainer;
