import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  Card,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TableBody,
  Button,
  IconButton,
  SvgIcon,
  CardHeader,
  Divider,
  Grid,
  TextField,
  CardContent,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/Add";
import ModelFieldFormItem from "./ModelFieldFormItem";
import { useForm } from "react-hook-form";
import { ModelFieldDoc } from "../../types";
import isEqual from "lodash/isEqual";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles(() => ({
  fieldNameCell: {
    width: 150,
  },
  typeCell: {
    width: 100,
  },
  arrayCell: {
    width: 50,
  },
  formatCell: {
    width: 120,
  },
  requiredCell: {
    width: 50,
  },
  addButton: {
    justifyContent: "start",
  },
  submit: {
    display: "none",
  },
}));

export interface ModelFormValues {
  fieldName: string;
  fieldType: string;
  format: string;
  isRequired: boolean;
  isArray: boolean;
  description: string;
  enum: string;
  target?: ModelFieldDoc;
  modelName: string;
  modelDescription: string;
}

export interface ModelFormProps {
  onSubmit: (data: ModelFormValues) => void;
  modelFields: ModelFieldDoc[];
  onDelete: (modelField: ModelFieldDoc) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  onSubmit,
  modelFields,
  onDelete,
}) => {
  const classes = useStyles();

  const [isNewFormVisible, setIsNewFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [currentModelField, setCurrentModelField] = useState<
    ModelFieldDoc | undefined
  >(undefined);
  const [fieldNameToFocus, setFieldNameToFocus] = useState<
    keyof ModelFormValues | undefined
  >(undefined);

  const isFocusingRef = useRef<boolean>(false);
  const modelNameInputRef = useRef<any>(undefined);

  const showNewForm = useCallback(() => {
    setIsEditFormVisible(false);
    setFieldNameToFocus(undefined);
    setCurrentModelField(undefined);
    setIsNewFormVisible(true);
  }, []);

  const defaultValues: ModelFormValues = useMemo(() => {
    return {
      fieldName: currentModelField?.fieldName.value || "",
      isRequired: currentModelField ? currentModelField.isRequired.value : true,
      fieldType: currentModelField?.fieldType.value || "string",
      format: currentModelField?.format.value || "없음",
      enum: currentModelField?.enum.value || "없음",
      description: currentModelField?.description.value || "",
      isArray: currentModelField ? currentModelField.isArray.value : false,
      modelName: "",
      modelDescription: "",
    };
  }, [currentModelField]);

  const formProps = useForm<ModelFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const {
    handleSubmit,
    errors,
    watch,
    getValues,
    setValue,
    register,
    trigger,
  } = formProps;

  const watchedValues = watch();

  const handleOnSubmit = useCallback(
    async (values) => {
      setCurrentModelField(undefined);
      let isSubmitted = false;
      await handleSubmit((_data) => {
        isSubmitted = true;
        onSubmit({ ...values, target: currentModelField });
      })();
      if (!isSubmitted) {
        return;
      }
      setIsNewFormVisible(false);
      setIsEditFormVisible(false);
    },
    [currentModelField, handleSubmit, onSubmit]
  );

  const isFieldModified = useMemo(() => {
    // 모델 정보는 제외하고 비교
    return !isEqual(
      { ...watchedValues, modelName: undefined, modelDescription: undefined },
      { ...defaultValues, modelName: undefined, modelDescription: undefined }
    );
  }, [defaultValues, watchedValues]);

  const hideForms = useCallback(() => {
    setIsEditFormVisible(false);
    setIsNewFormVisible(false);
    setCurrentModelField(undefined);
  }, []);

  const onBlurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const handleOnBlur = useCallback(() => {
    isFocusingRef.current = false;

    onBlurTimeout.current = setTimeout(() => {
      const hasError = !!Object.keys(errors).length;
      if (!currentModelField) {
        const isCanceled = isEqual(getValues(), defaultValues);
        if (isCanceled && !isFocusingRef.current) {
          setIsNewFormVisible(false);
          return;
        }
      }
      if (!hasError && !isFocusingRef.current && isFieldModified) {
        handleOnSubmit(getValues());
      } else if (!isFocusingRef.current && !hasError) {
        hideForms();
      }
    }, 100);
  }, [
    currentModelField,
    defaultValues,
    errors,
    getValues,
    handleOnSubmit,
    hideForms,
    isFieldModified,
  ]);

  const handleOnFocus = useCallback(() => {
    if (!getValues("modelName")) {
      modelNameInputRef.current.focus();
      trigger("modelName");
      hideForms();
      return;
    }
    isFocusingRef.current = true;
  }, [getValues, hideForms, trigger]);

  const showEditForm = useCallback(
    (modelField: ModelFieldDoc, fieldName: keyof ModelFormValues) => {
      if (isNewFormVisible) {
        setIsNewFormVisible(false);
      } else {
        setCurrentModelField(modelField);
        setIsEditFormVisible(true);
        setFieldNameToFocus(fieldName);
      }
    },
    [isNewFormVisible]
  );

  useEffect(() => {
    if (currentModelField) {
      setValue("fieldName", defaultValues.fieldName, { shouldValidate: true });
      setValue("isRequired", defaultValues.isRequired, {
        shouldValidate: true,
      });
      setValue("fieldType", defaultValues.fieldType, { shouldValidate: true });
      setValue("format", defaultValues.format, { shouldValidate: true });
      setValue("enum", defaultValues.enum, { shouldValidate: true });
      setValue("description", defaultValues.description, {
        shouldValidate: true,
      });
    }
  }, [currentModelField, defaultValues, setValue]);

  useEffect(() => {
    return () => {
      clearTimeout(onBlurTimeout.current);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleOnSubmit(getValues());
      }}
      noValidate
    >
      <Card>
        <CardHeader title="모델 편집" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item sm={5}>
              <TextField
                label="모델명"
                autoFocus
                name="modelName"
                inputRef={(e) => {
                  modelNameInputRef.current = e;
                  register(e, {
                    required: "모델명을 입력해주세요.",
                    maxLength: {
                      value: 40,
                      message: "별로 좋은 생각이 아닌 것 같아요.",
                    },
                  });
                }}
                variant="outlined"
                fullWidth
                required
                error={!!errors.modelName}
                helperText={errors.modelName?.message}
                size="small"
              />
            </Grid>
            <Grid item sm={7}>
              <TextField
                label="설명"
                name="modelDescription"
                inputRef={register({
                  maxLength: {
                    value: 100,
                    message: "설명이 너무 길어요.",
                  },
                })}
                variant="outlined"
                fullWidth
                error={!!errors.modelDescription}
                helperText={errors.modelDescription?.message}
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={700}>
            <Table>
              <caption></caption>
              <TableHead>
                <TableRow>
                  <TableCell component="th" className={classes.fieldNameCell}>
                    필드명*
                  </TableCell>
                  <TableCell align="center" className={classes.requiredCell}>
                    필수
                  </TableCell>
                  <TableCell align="center" className={classes.arrayCell}>
                    배열
                  </TableCell>
                  <TableCell className={classes.typeCell}>타입*</TableCell>
                  <TableCell className={classes.formatCell}>포맷</TableCell>
                  <TableCell className={classes.formatCell}>열거형</TableCell>
                  <TableCell>설명</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modelFields.map((modelField) => (
                  <TableRow key={modelField.id}>
                    {isEditFormVisible &&
                    currentModelField?.id === modelField.id ? (
                      <ModelFieldFormItem
                        formProps={formProps}
                        autoFocusField={fieldNameToFocus}
                        onBlur={handleOnBlur}
                        onFocus={handleOnFocus}
                        defaultValues={defaultValues}
                        modelFields={modelFields}
                      />
                    ) : (
                      <>
                        <TableCell
                          onClick={() => showEditForm(modelField, "fieldName")}
                        >
                          {modelField.fieldName.value}
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={() => showEditForm(modelField, "isRequired")}
                        >
                          {modelField.isRequired.value ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell
                          align="center"
                          onClick={() => showEditForm(modelField, "isArray")}
                        >
                          {modelField.isArray.value ? (
                            <CheckIcon fontSize="small" />
                          ) : (
                            ""
                          )}
                        </TableCell>
                        <TableCell
                          onClick={() => showEditForm(modelField, "fieldType")}
                        >
                          {modelField.fieldType.value}
                        </TableCell>

                        <TableCell
                          onClick={() => showEditForm(modelField, "format")}
                        >
                          {modelField.format.value}
                        </TableCell>
                        <TableCell
                          onClick={() => showEditForm(modelField, "enum")}
                        >
                          {modelField.enum.value}
                        </TableCell>
                        <TableCell
                          onClick={() =>
                            showEditForm(modelField, "description")
                          }
                        >
                          {modelField.description.value}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => onDelete(modelField)}>
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
                    <ModelFieldFormItem
                      formProps={formProps}
                      onBlur={handleOnBlur}
                      onFocus={handleOnFocus}
                      autoFocusField={fieldNameToFocus}
                      defaultValues={defaultValues}
                      modelFields={modelFields}
                    />
                  ) : (
                    <TableCell colSpan={8}>
                      <Button
                        className={classes.addButton}
                        fullWidth
                        color="secondary"
                        onClick={showNewForm}
                      >
                        <AddIcon fontSize="small" /> 새로운 필드 추가
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

export default ModelForm;
