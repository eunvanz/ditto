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
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/Add";
import ModelFieldFormItem from "./ModelFieldFormItem";
import { useForm } from "react-hook-form";
import { ModelFieldDoc } from "../../types";
import isEqual from "lodash/isEqual";

const useStyles = makeStyles(() => ({
  fieldNameCell: {
    width: 150,
  },
  typeCell: {
    width: 100,
  },
  formatCell: {
    width: 120,
  },
  requiredCell: {
    width: 40,
  },
  addButton: {
    justifyContent: "start",
  },
  submit: {
    display: "none",
  },
}));

export interface ModelFieldFormValues {
  fieldName: string;
  fieldType: string;
  format: string;
  isRequired: boolean;
  description: string;
  enum: string;
  target?: ModelFieldDoc;
}

export interface ModelFieldFormProps {
  onSubmit: (data: ModelFieldFormValues) => void;
}

const ModelFieldForm: React.FC<ModelFieldFormProps> = ({ onSubmit }) => {
  const classes = useStyles();

  const [isNewFormVisible, setIsNewFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [currentModelField, setCurrentModelField] = useState<
    ModelFieldDoc | undefined
  >(undefined);
  const [fieldNameToFocus, setFieldNameToFocus] = useState<
    keyof ModelFieldFormValues | undefined
  >(undefined);

  const isFocusingRef = useRef<boolean>(false);

  const showNewForm = useCallback(() => {
    setIsEditFormVisible(false);
    setFieldNameToFocus(undefined);
    setIsNewFormVisible(true);
  }, []);

  const defaultValues: ModelFieldFormValues = useMemo(() => {
    return {
      fieldName: currentModelField?.fieldName.value || "",
      isRequired: currentModelField ? currentModelField.isRequired.value : true,
      fieldType: currentModelField?.fieldType.value || "string",
      format: currentModelField?.format.value || "없음",
      enum: currentModelField?.enum.value || "없음",
      description: currentModelField?.description.value || "",
    };
  }, [currentModelField]);

  const formProps = useForm<ModelFieldFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const { handleSubmit, errors, watch, getValues, setValue } = formProps;

  const watchedValues = watch();

  const handleOnSubmit = useCallback(
    (values) => {
      setIsNewFormVisible(false);
      setIsEditFormVisible(false);
      handleSubmit((_data) => {
        onSubmit({ ...values, target: currentModelField });
      })();
      setCurrentModelField(undefined);
    },
    [currentModelField, handleSubmit, onSubmit]
  );

  const isModified = useMemo(() => {
    if (!currentModelField) {
      return true;
    }
    return !isEqual(watchedValues, defaultValues);
  }, [currentModelField, defaultValues, watchedValues]);

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
      if (!hasError && !isFocusingRef.current && isModified) {
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
    isModified,
  ]);

  const handleOnFocus = useCallback(() => {
    isFocusingRef.current = true;
  }, []);

  const showEditForm = useCallback(
    (modelField: ModelFieldDoc, fieldName: keyof ModelFieldFormValues) => {
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
        <PerfectScrollbar>
          <Box minWidth={700}>
            <Table>
              <caption></caption>
              <TableHead>
                <TableRow>
                  <TableCell component="th" className={classes.fieldNameCell}>
                    필드명*
                  </TableCell>
                  <TableCell className={classes.requiredCell}>필수</TableCell>
                  <TableCell className={classes.typeCell}>타입*</TableCell>
                  <TableCell className={classes.formatCell}>포맷</TableCell>
                  <TableCell className={classes.formatCell}>열거형</TableCell>
                  <TableCell>설명</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {isNewFormVisible ? (
                    <ModelFieldFormItem
                      formProps={formProps}
                      onBlur={handleOnBlur}
                      onFocus={handleOnFocus}
                      autoFocusField={fieldNameToFocus}
                      defaultValues={defaultValues}
                    />
                  ) : (
                    <TableCell colSpan={7}>
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

export default ModelFieldForm;
