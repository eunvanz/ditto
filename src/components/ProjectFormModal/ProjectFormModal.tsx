import React from "react";
import ProjectForm from "../ProjectForm";
import Modal from "../Modal";
import { ModalBase } from "../../types";

export interface ProjectFormModalProps extends ModalBase {
  isModification: boolean;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isVisible,
  onClose,
  isModification,
}) => {
  return (
    <Modal
      title={isModification ? "Modify project" : "Create new project"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <ProjectForm />
    </Modal>
  );
};

export default ProjectFormModal;
