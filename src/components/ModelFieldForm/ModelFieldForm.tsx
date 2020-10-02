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
  target?: ModelFieldDoc;
}

export interface ModelFieldFormProps {
  onSubmit: (data: ModelFieldFormValues) => void;
}

const ModelFieldForm: React.FC<ModelFieldFormProps> = ({ onSubmit }) => {
  const classes = useStyles();

  const formProps = useForm<ModelFieldFormValues>({
    mode: "onChange",
  });

  const {
    handleSubmit,
    errors,
    watch,
    getValues,
    setValue,
    register,
  } = formProps;

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

  const handleOnSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      setIsNewFormVisible(false);
      setIsEditFormVisible(false);
      handleSubmit((data) => {
        onSubmit({ ...data, target: currentModelField });
      })();
      setCurrentModelField(undefined);
    },
    [currentModelField, handleSubmit, onSubmit]
  );

  const watchedValues = watch();

  const defaultValues = useMemo(() => {
    return {
      fieldName: currentModelField?.fieldName,
      isRequired: currentModelField?.isRequired,
      fieldType: currentModelField?.fieldType,
      format: currentModelField?.format,
      enum: currentModelField?.enum,
      description: currentModelField?.description,
    };
  }, [currentModelField]);

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
    currentModelField,
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
      setValue("fieldName", currentModelField.fieldName.value, {
        shouldValidate: true,
      });
      setValue("isRequired", currentModelField.isRequired.value, {
        shouldValidate: true,
      });
      setValue("fieldType", currentModelField.fieldType.value, {
        shouldValidate: true,
      });
      setValue("format", currentModelField.format.value, {
        shouldValidate: true,
      });
      setValue("enum", currentModelField.enum.value, { shouldValidate: true });
      setValue("description", currentModelField.description.value, {
        shouldValidate: true,
      });
    }
  }, [currentModelField, setValue]);

  useEffect(() => {
    return () => {
      clearTimeout(onBlurTimeout.current);
    };
  }, []);

  useEffect(() => {
    register("fieldType", { required: "타입을 선택해주세요." });
    register("format");
  }, [register]);

  return (
    <form onSubmit={handleOnSubmit} noValidate>
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
