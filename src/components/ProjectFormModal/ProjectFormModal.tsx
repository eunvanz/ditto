import React from "react";
import { ModalBase } from "../../types";
import Modal from "../Modal";
import ProjectForm from "../ProjectForm";

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
