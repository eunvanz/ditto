import React from "react";
import ProjectForm from "../ProjectForm";
import Modal from "../Modal";

export interface ProjectFormModalProps {
  isVisible: boolean;
  onClose: () => void;
  isModification: boolean;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isVisible,
  onClose,
  isModification,
}) => {
  return (
    <Modal
      title={isModification ? "프로젝트 설정" : "새로운 프로젝트"}
      isVisible={isVisible}
      onClose={onClose}
    >
      <ProjectForm />
    </Modal>
  );
};

export default ProjectFormModal;
