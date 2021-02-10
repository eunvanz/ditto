import React from "react";
import GroupFormModal from "./GroupFormModal";
import useGroupFormModal from "./useGroupFormModal";

const GroupFormModalContainer = () => {
  const props = useGroupFormModal();

  return <GroupFormModal {...props} />;
};

export default GroupFormModalContainer;
