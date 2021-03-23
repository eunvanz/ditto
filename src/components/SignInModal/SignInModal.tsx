import React from "react";
import Modal from "../Modal";
import SignInForm from "../SignInForm";

export interface SignInModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose} title="Sign in" maxWidth="xs">
      <SignInForm />
    </Modal>
  );
};

export default SignInModal;
