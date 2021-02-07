import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assertNotEmpty } from "../../../helpers/commonHelpers";
import useProjectByParam from "../../../hooks/useProjectByParam";
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

  return {
    project,
    isSubmitting,
    onSubmit,
    onDelete,
  };
};

export default useProjectBasicFormProps;
