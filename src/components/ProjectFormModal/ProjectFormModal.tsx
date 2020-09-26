import React from "react";
import ProjectForm from "../ProjectForm";
import Modal from "../Modal";

export interface ProjectFormModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <Modal title="새 프로젝트" isVisible={isVisible} onClose={onClose}>
      <ProjectForm />
    </Modal>
  );
};

export default ProjectFormModal;
