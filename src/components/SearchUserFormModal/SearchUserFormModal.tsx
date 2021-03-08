import React from "react";
import { ModalBase } from "../../types";
import Modal from "../Modal";
import SearchUserForm from "../SearchUserForm";

export interface SearchUserFormModalProps extends ModalBase {}

const SearchUserFormModal = ({
  isVisible,
  onClose,
}: SearchUserFormModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onClose={onClose}
      title="Add members"
      disableBackdropClick
    >
      <SearchUserForm />
    </Modal>
  );
};

export default SearchUserFormModal;
