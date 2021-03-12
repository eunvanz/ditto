import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import useProjectByParam from "../../../hooks/useProjectByParam";
import useProjectRole from "../../../hooks/useProjectRole";
import FirebaseSelectors from "../../../store/Firebase/FirebaseSelectors";
import ProgressSelectors from "../../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../../store/Project/ProjectSlice";
import {
  ProjectBasicFormProps,
  ProjectBasicFormValues,
} from "./ProjectBasicForm";

const useProjectBasicFormProps: () => ProjectBasicFormProps = () => {
  const dispatch = useDispatch();

  const { project } = useProjectByParam();
  assertNotEmpty(project);

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitProjectForm.type
    )
  );

  const onSubmit = useCallback(
    (values: ProjectBasicFormValues) => {
      dispatch(
        ProjectActions.submitProjectForm({ data: values, type: "modify" })
      );
    },
    [dispatch]
  );

  const onDelete = useCallback(() => {
    dispatch(ProjectActions.deleteProject(project));
  }, [dispatch, project]);

  const role = useProjectRole(project);

  const userProfile = useSelector(FirebaseSelectors.selectUserProfile);

  const onLeave = useCallback(() => {
    dispatch(
      ProjectActions.deleteMember({
        member: userProfile,
        role,
      })
    );
  }, [dispatch, role, userProfile]);

  return {
    project,
    isSubmitting,
    onSubmit,
    onDelete,
    role,
    onLeave,
  };
};

export default useProjectBasicFormProps;
