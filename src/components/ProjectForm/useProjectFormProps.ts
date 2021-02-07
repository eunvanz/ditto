import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressSelectors from "../../store/Progress/ProgressSelectors";
import { ProjectActions } from "../../store/Project/ProjectSlice";
import UiSelectors from "../../store/Ui/UiSelectors";
import { ProjectFormProps, ProjectFormValues } from "./ProjectForm";

const useProjectFormProps: () => ProjectFormProps = () => {
  const dispatch = useDispatch();

  const isSubmitting = useSelector(
    ProgressSelectors.createInProgressSelector(
      ProjectActions.submitProjectForm.type
    )
  );

  const { project } = useSelector(UiSelectors.selectProjectFormModal);

  const defaultValues = useMemo(() => {
    return project
      ? { title: project.title, description: project.description }
      : undefined;
  }, [project]);

  const onSubmit = useCallback(
    (values: ProjectFormValues) => {
      dispatch(
        ProjectActions.submitProjectForm({ data: values, type: "create" })
      );
    },
    [dispatch]
  );

  return {
    onSubmit,
    isSubmitting,
    defaultValues,
  };
};

export default useProjectFormProps;
