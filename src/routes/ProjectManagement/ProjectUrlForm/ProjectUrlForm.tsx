import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/Add";
import { ProjectUrlDoc } from "../../../types";
import {
  makeStyles,
  Divider,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  TableBody,
  IconButton,
  SvgIcon,
  Button,
} from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ProjectUrlFormItem from "./ProjectUrlFormItem";

const useStyles = makeStyles(() => ({
  root: {},
  labelCell: {
    width: 250,
  },
  urlCell: {
    width: 350,
  },
  submit: {
    display: "none",
  },
  addButton: {
    justifyContent: "start",
  },
}));

export interface ProjectUrlFormValues {
  label: string;
  url: string;
  description?: string;
  target?: ProjectUrlDoc;
}

export interface ProjectUrlFormProps {
  onSubmit: (values: ProjectUrlFormValues) => void;
  onDelete: (projectUrl: ProjectUrlDoc) => void;
  projectUrls: ProjectUrlDoc[];
}

const ProjectUrlForm: React.FC<ProjectUrlFormProps> = ({
  onSubmit,
  onDelete,
  projectUrls,
}) => {
  const formProps = useForm<ProjectUrlFormValues>({
    mode: "onChange",
  });

  const { handleSubmit, errors, watch, getValues, setValue } = formProps;

  const classes = useStyles();

  const [isNewFormVisible, setIsNewFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [currentProjectUrl, setCurrentProjectUrl] = useState<
    ProjectUrlDoc | undefined
  >(undefined);
  const [fieldNameToFocus, setFieldNameToFocus] = useState<
    keyof ProjectUrlFormValues | undefined
  >(undefined);

  const isFocusingRef = useRef<boolean>(false);

  const showNewForm = useCallback(() => {
    setIsEditFormVisible(false);
    setFieldNameToFocus(undefined);
    setIsNewFormVisible(true);
  }, []);

  const handleOnSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      setIsNewFormVisible(false);
      setIsEditFormVisible(false);
      handleSubmit((data) => {
        onSubmit({ ...data, target: currentProjectUrl });
      })();
      setCurrentProjectUrl(undefined);
    },
    [currentProjectUrl, handleSubmit, onSubmit]
  );

  const watchedValues = watch();

  const defaultValues = useMemo(() => {
    return {
      label: currentProjectUrl?.label,
      url: currentProjectUrl?.url,
      description: currentProjectUrl?.description,
    };
  }, [currentProjectUrl]);

  const isModified = useMemo(() => {
    if (!currentProjectUrl) {
      return true;
    }
    return !isEqual(watchedValues, defaultValues);
  }, [currentProjectUrl, defaultValues, watchedValues]);

  const hideForms = useCallback(() => {
    setIsEditFormVisible(false);
    setIsNewFormVisible(false);
    setCurrentProjectUrl(undefined);
  }, []);

  const onBlurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const handleOnBlur = useCallback(() => {
    isFocusingRef.current = false;

    onBlurTimeout.current = setTimeout(() => {
      const hasError = !!Object.keys(errors).length;
      if (!currentProjectUrl) {
        // 모든 필드가 비어있는 경우 작성 취소로 간주
        const isCanceled = Object.entries(getValues()).every(
          ([, value]) => !value
        );
        if (isCanceled && !isFocusingRef.current) {
          setIsNewFormVisible(false);
          return;
        }
      }
      if (!hasError && !isFocusingRef.current && isModified) {
        handleOnSubmit();
      } else if (!isFocusingRef.current && !hasError) {
        hideForms();
      }
    }, 100);
  }, [
    currentProjectUrl,
    errors,
    getValues,
    handleOnSubmit,
    hideForms,
    isModified,
  ]);

  const handleOnFocus = useCallback(() => {
    isFocusingRef.current = true;
  }, []);

  const showEditForm = useCallback(
    (projectUrl: ProjectUrlDoc, fieldName: keyof ProjectUrlFormValues) => {
      if (isNewFormVisible) {
        setIsNewFormVisible(false);
      } else {
        setCurrentProjectUrl(projectUrl);
        setIsEditFormVisible(true);
        setFieldNameToFocus(fieldName);
      }
    },
    [isNewFormVisible]
  );

  useEffect(() => {
    if (currentProjectUrl) {
      setValue("label", currentProjectUrl.label, { shouldValidate: true });
      setValue("url", currentProjectUrl.url, { shouldValidate: true });
      setValue("description", currentProjectUrl.description, {
        shouldValidate: true,
      });
    }
  }, [currentProjectUrl, setValue]);

  useEffect(() => {
    return () => {
      clearTimeout(onBlurTimeout.current);
    };
  }, []);

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card>
        <CardHeader title="베이스 URL" />
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={700}>
            <Table>
              <caption>
                베이스 URL은 리퀘스트 URL 설정 시에 편리하게 사용할 수 있습니다.
              </caption>
              <TableHead>
                <TableRow>
                  <TableCell component="th" className={classes.labelCell}>
                    라벨*
                  </TableCell>
                  <TableCell className={classes.urlCell}>URL*</TableCell>
                  <TableCell>설명</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projectUrls.map((projectUrl) => (
                  <TableRow key={projectUrl.id}>
                    {isEditFormVisible &&
                    currentProjectUrl?.id === projectUrl.id ? (
                      <ProjectUrlFormItem
                        formProps={formProps}
                        autoFocusField={fieldNameToFocus}
                        onBlur={handleOnBlur}
                        onFocus={handleOnFocus}
                      />
                    ) : (
                      <>
                        <TableCell
                          onClick={() => showEditForm(projectUrl, "label")}
                        >
                          {projectUrl.label}
                        </TableCell>
                        <TableCell
                          onClick={() => showEditForm(projectUrl, "url")}
                        >
                          {projectUrl.url}
                        </TableCell>
                        <TableCell
                          onClick={() =>
                            showEditForm(projectUrl, "description")
                          }
                        >
                          {projectUrl.description}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => onDelete(projectUrl)}>
                            <SvgIcon fontSize="small">
                              <DeleteOutlineIcon />
                            </SvgIcon>
                          </IconButton>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
                <TableRow>
                  {isNewFormVisible ? (
                    <ProjectUrlFormItem
                      formProps={formProps}
                      autoFocusField={fieldNameToFocus}
                      onBlur={handleOnBlur}
                      onFocus={handleOnFocus}
                    />
                  ) : (
                    <TableCell colSpan={4} onClick={showNewForm}>
                      <Button
                        className={classes.addButton}
                        fullWidth
                        color="secondary"
                      >
                        <AddIcon fontSize="small" /> 새로운 베이스 URL 등록
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
      <button className={classes.submit} type="submit" />
    </form>
  );
};

export default ProjectUrlForm;
