import React, {
  useMemo,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import {
  TableCell,
  TextField,
  Box,
  makeStyles,
  Checkbox,
  IconButton,
  SvgIcon,
  TableRow,
} from "@material-ui/core";
import { Controller, useForm } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckIcon from "@material-ui/icons/Check";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import isEqual from "lodash/isEqual";
import { ModelFieldFormValues } from "./ModelForm";
import { fieldTypes, formats, FIELD_TYPE, ModelFieldDoc } from "../../types";

const useStyles = makeStyles(() => ({
  autocomplete: {
    "& .MuiAutocomplete-inputRoot": {
      paddingBottom: 0,
    },
  },
}));

export interface ModelFieldFormItemProps {
  /**
   * 필드명 validation에 필요한 modelFields
   */
  modelFields: ModelFieldDoc[];
  /**
   * 현재 수정중인 modelField
   */
  modelField?: ModelFieldDoc;
  onSubmit: (data: ModelFieldFormValues) => void;
  /**
   * 새로운 필드 생성을 위한 폼일 경우 true
   */
  isNew?: boolean;
  onDelete?: () => void;
}

const ModelFormItem: React.FC<ModelFieldFormItemProps> = ({
  modelFields,
  modelField,
  onSubmit,
  isNew = false,
  onDelete,
}) => {
  const classes = useStyles();

  const defaultValues: ModelFieldFormValues = useMemo(() => {
    return {
      fieldName: modelField?.fieldName.value || "",
      isRequired: modelField ? modelField.isRequired.value : true,
      fieldType: modelField?.fieldType.value || "string",
      format: modelField?.format.value || "없음",
      enum: modelField?.enum.value || "없음",
      description: modelField?.description.value || "",
      isArray: modelField ? modelField.isArray.value : false,
    };
  }, [modelField]);

  const [isFormVisible, setIsFormVisible] = useState(isNew);
  const [autoFocusField, setAutoFocusField] = useState<
    keyof ModelFieldFormValues
  >("fieldName");

  const isFocusingRef = useRef<boolean>(false);
  const onBlurTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const formProps = useForm<ModelFieldFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const {
    errors,
    setValue,
    getValues,
    watch,
    control,
    handleSubmit,
    reset,
  } = formProps;

  const watchedFieldType = watch("fieldType");

  const formatOptions = useMemo(() => {
    if (watchedFieldType) {
      return formats[watchedFieldType as FIELD_TYPE];
    }
    return ["없음"];
  }, [watchedFieldType]);

  useEffect(() => {
    setValue("format", formatOptions[0], { shouldValidate: true });
  }, [formatOptions, setValue]);

  const handleOnSubmit = useCallback(async () => {
    const values = getValues();
    await handleSubmit((_data) => {
      onSubmit({ ...values, target: modelField });
    })();
    // form의 값이 초기로 돌아가는 현상이 있어서 직접 리셋해줌
    reset(values);
    setIsFormVisible(false);
  }, [getValues, handleSubmit, modelField, onSubmit, reset]);

  const watchedValues = watch();

  const isFieldModified = useMemo(() => {
    return !isEqual(watchedValues, defaultValues);
  }, [defaultValues, watchedValues]);

  const handleOnBlur = useCallback(() => {
    isFocusingRef.current = false;
    onBlurTimeoutRef.current = setTimeout(() => {
      const hasError = !!Object.keys(errors).length;
      if (isNew) {
        const isCanceled = isEqual(getValues(), defaultValues);
        if (isCanceled && !isFocusingRef.current) {
          return;
        }
      }
      if (!hasError && !isFocusingRef.current && isFieldModified) {
        handleOnSubmit();
      } else if (!isFocusingRef.current && !hasError) {
        setIsFormVisible(false);
      }
    }, 100);
  }, [
    errors,
    isNew,
    isFieldModified,
    getValues,
    defaultValues,
    handleOnSubmit,
  ]);

  const handleOnFocus = useCallback(() => {
    isFocusingRef.current = true;
  }, []);

  const showForm = useCallback((focusField) => {
    setIsFormVisible(true);
    setAutoFocusField(focusField);
  }, []);

  const createCellClickHandler = useCallback(
    (focusField) => {
      return !isFormVisible ? () => showForm(focusField) : undefined;
    },
    [isFormVisible, showForm]
  );

  const handleOnPressEnter = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleOnBlur();
      } else if (e.key === "Escape") {
        setIsFormVisible(false);
      }
    },
    [handleOnBlur]
  );

  useEffect(() => {
    return () => {
      clearTimeout(onBlurTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isFormVisible) {
      document.addEventListener("keyup", handleOnPressEnter);
      return () => {
        document.removeEventListener("keyup", handleOnPressEnter);
      };
    }
  }, [handleOnPressEnter, isFormVisible]);

  return (
    <TableRow>
      <TableCell onClick={createCellClickHandler("fieldName")}>
        {isFormVisible ? (
          <Controller
            control={control}
            name="fieldName"
            defaultValue={defaultValues.fieldName}
            rules={{
              required: "필드명을 입력해주세요.",
              maxLength: {
                value: 40,
                message: "너무 긴 필드명은 좋은 생각이 아닌 것 같아요.",
              },
              validate: (data: string) => {
                const isDup = modelFields
                  .filter(
                    // 현재 수정중인 필드는 제외
                    (item) => item.fieldName.value !== defaultValues?.fieldName
                  )
                  .some((modelField) => modelField.fieldName.value === data);
                return isDup ? "중복되는 필드가 있어요." : true;
              },
            }}
            render={(props) => {
              return (
                <TextField
                  {...props}
                  size="small"
                  autoFocus={autoFocusField === "fieldName"}
                  fullWidth
                  required
                  error={!!errors.fieldName}
                  helperText={errors.fieldName?.message}
                  onBlur={handleOnBlur}
                  onFocus={handleOnFocus}
                  placeholder="필드명"
                />
              );
            }}
          />
        ) : (
          modelField?.fieldName.value
        )}
      </TableCell>
      <TableCell align="center" onClick={createCellClickHandler("isRequired")}>
        {isFormVisible ? (
          <Controller
            control={control}
            name="isRequired"
            render={(props) => (
              <Checkbox
                {...props}
                autoFocus={autoFocusField === "isRequired"}
                defaultChecked={defaultValues.isRequired}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
              />
            )}
          />
        ) : modelField?.isRequired.value ? (
          <CheckIcon fontSize="small" />
        ) : (
          ""
        )}
      </TableCell>
      <TableCell align="center" onClick={createCellClickHandler("isArray")}>
        {isFormVisible ? (
          <Controller
            control={control}
            name="isArray"
            render={(props) => (
              <Checkbox
                {...props}
                autoFocus={autoFocusField === "isArray"}
                defaultChecked={defaultValues.isArray}
                checked={props.value}
                onChange={(e) => props.onChange(e.target.checked)}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
              />
            )}
          />
        ) : modelField?.isArray.value ? (
          <CheckIcon fontSize="small" />
        ) : (
          ""
        )}
      </TableCell>
      <TableCell onClick={createCellClickHandler("fieldType")}>
        {isFormVisible ? (
          <Controller
            control={control}
            name="fieldType"
            defaultValue={defaultValues.fieldType}
            rules={{ required: "타입을 선택해주세요." }}
            render={({ value }) => {
              return (
                <Autocomplete
                  value={value}
                  openOnFocus
                  className={classes.autocomplete}
                  options={fieldTypes}
                  onChange={(_e, value) => {
                    setValue("fieldType", value, { shouldValidate: true });
                  }}
                  disableClearable
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        required
                        placeholder="타입"
                        autoFocus={autoFocusField === "fieldType"}
                        error={!!errors.fieldType}
                        helperText={errors.fieldType?.message}
                        onBlur={handleOnBlur}
                        onFocus={handleOnFocus}
                      />
                    );
                  }}
                />
              );
            }}
          />
        ) : (
          modelField?.fieldType.value
        )}
      </TableCell>
      <TableCell onClick={createCellClickHandler("format")}>
        {isFormVisible ? (
          <Controller
            control={control}
            name="format"
            defaultValue={defaultValues.format || formatOptions[0]}
            render={({ value }) => {
              return (
                <Autocomplete
                  value={value}
                  openOnFocus
                  className={classes.autocomplete}
                  options={formatOptions}
                  onChange={(_e, value) =>
                    setValue("format", value, { shouldValidate: true })
                  }
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      autoFocus={autoFocusField === "format"}
                      placeholder="포맷"
                      onBlur={handleOnBlur}
                      onFocus={handleOnFocus}
                    />
                  )}
                />
              );
            }}
          />
        ) : (
          modelField?.format.value
        )}
      </TableCell>
      <TableCell onClick={createCellClickHandler("enum")}>
        {isFormVisible ? (
          <Controller
            control={control}
            name="enum"
            defaultValue={defaultValues.enum}
            render={({ value }) => {
              return (
                <Autocomplete
                  value={value}
                  openOnFocus
                  className={classes.autocomplete}
                  options={["없음"]}
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      autoFocus={autoFocusField === "enum"}
                      placeholder="열거형"
                      onBlur={handleOnBlur}
                      onFocus={handleOnFocus}
                    />
                  )}
                />
              );
            }}
          />
        ) : (
          modelField?.enum.value
        )}
      </TableCell>
      <TableCell onClick={createCellClickHandler("description")}>
        {isFormVisible ? (
          <Controller
            control={control}
            name="description"
            defaultValue={defaultValues.description}
            rules={{
              maxLength: {
                value: 200,
                message: "설명이 너무 길어요.",
              },
            }}
            render={(props) => (
              <TextField
                {...props}
                size="small"
                autoFocus={autoFocusField === "description"}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
                onBlur={handleOnBlur}
                onFocus={handleOnFocus}
                placeholder="설명"
              />
            )}
          />
        ) : (
          modelField?.description.value
        )}
      </TableCell>
      <TableCell align="right">
        {isFormVisible ? (
          <Box padding={3} />
        ) : (
          <IconButton onClick={onDelete}>
            <SvgIcon fontSize="small">
              <DeleteOutlineIcon />
            </SvgIcon>
          </IconButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default ModelFormItem;
