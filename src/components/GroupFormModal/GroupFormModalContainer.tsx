import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import UiSelectors from "../../store/Ui/UiSelectors";
import { UiActions } from "../../store/Ui/UiSlice";
import GroupFormModal from "./GroupFormModal";

const GroupFormModalContainer = () => {
  const dispatch = useDispatch();

  const { isVisible, group } = useSelector(UiSelectors.selectGroupFormModal);

  const defaultValues = useMemo(() => {
    return group ? { name: group.name } : undefined;
  }, [group]);

  // return (
  //   <GroupFormModal
  //     defaultValues={defaultValues}
  //     isVisible={isVisible}
  //     onClose={() => dispatch(UiActions.hideGroupFormModal())}
  //   />
  // );
  return null;
};

export default GroupFormModalContainer;
