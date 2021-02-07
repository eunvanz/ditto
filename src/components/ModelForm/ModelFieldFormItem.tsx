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
import ClearIcon from "@material-ui/icons/Clear";
import { ModelFieldFormValues } from "./ModelForm";
import ModelForm from "./index";
import {
  fieldTypes,
  formats,
  FIELD_TYPE,
  ModelFieldDoc,
  ModelDoc,
  FORMAT,
  EnumerationDoc,
} from "../../types";
import {
  getIntentionPaddingByDepth,
  patterns,
} from "../../helpers/projectHelpers";

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
  onDelete?: () => void;
  depth?: number;
  /**
   * 같은 프로젝트 내의 모델들
   */
  projectModels: ModelDoc[];
  projectEnumerations: EnumerationDoc[];
  onCancel: () => void;
  isSubmitting: boolean;
  isFormVisible: boolean;
  onClickCell?: () => void;
}

const ModelFormItem: React.FC<ModelFieldFormItemProps> = ({
  modelFields,
  modelField,
  onSubmit,
  onDelete,
  depth,
  projectModels,
  projectEnumerations,
  onCancel,
  isSubmitting,
  isFormVisible,
  onClickCell,
}) => {
  const classes = useStyles();

  const getFormatValue = useCallback(
    (fieldType: string, format: string) => {
      if (fieldType === FIELD_TYPE.OBJECT) {
        return (
          projectModels.find((model) => model.id === format)?.name ||
          FORMAT.NEW_MODEL
        );
      } else {
        return format;
      }
    },
    [projectModels]
  );

  const getEnumValue = useCallback(
    (enumId: string) => {
      return (
        projectEnumerations.find((enumeration) => enumeration.id === enumId)
          ?.name || "없음"
      );
    },
    [projectEnumerations]
  );

  const defaultValues: ModelFieldFormValues = useMemo(() => {
    return {
      fieldName: modelField?.fieldName.value || "",
      isRequired: modelField ? modelField.isRequired.value : true,
      fieldType: modelField?.fieldType.value || FIELD_TYPE.STRING,
      format: modelField
        ? getFormatValue(modelField.fieldType.value, modelField.format.value)
        : "없음",
      enum: modelField ? getEnumValue(modelField.enum.value) : "없음",
      description: modelField?.description.value || "",
      isArray: modelField ? modelField.isArray.value : false,
    };
  }, [getEnumValue, getFormatValue, modelField]);

  const [autoFocusField, setAutoFocusField] = useState<
    keyof ModelFieldFormValues
  >("fieldName");

  const formProps = useForm<ModelFieldFormValues>({
    mode: "onChange",
    defaultValues,
  });

  const {
    errors,
    setValue,
    watch,
    control,
    handleSubmit,
    reset,
    trigger,
    getValues,
  } = formProps;

  const watchedFieldType = watch("fieldType");

  const formatOptions = useMemo(() => {
    switch (watchedFieldType) {
      case FIELD_TYPE.BOOLEAN:
      case FIELD_TYPE.INTEGER:
      case FIELD_TYPE.NUMBER:
      case FIELD_TYPE.STRING:
        return formats[watchedFieldType as FIELD_TYPE];
      case FIELD_TYPE.OBJECT:
        return [FORMAT.NEW_MODEL, ...projectModels.map((model) => model.name)];
      default:
        return ["없음"];
    }
  }, [projectModels, watchedFieldType]);

  useEffect(() => {
    const format =
      modelField && modelField.fieldType.value === watchedFieldType
        ? getFormatValue(watchedFieldType, modelField?.format.value)
        : formatOptions[0];
    setValue("format", format, { shouldValidate: true });
    setValue("enum", "없음", { shouldValidate: true });
    // formatOptions가 디펜던시에 포함되면 QuickModelNameFormModal 노출 시 포맷이 바뀌는 이슈로 인해 추가
    // eslint-disable-next-line
  }, [modelField, watchedFieldType, setValue]);

  const handleOnSubmit = useCallback(async () => {
    trigger();
    await handleSubmit((data) => {
      const format =
        data.fieldType === FIELD_TYPE.OBJECT
          ? projectModels.find((model) => model.name === data.format)?.id ||
            FORMAT.NEW_MODEL
          : data.format;
      const enumValue =
        projectEnumerations.find(
          (enumeration) => enumeration.name === data.enum
        )?.id || "없음";
      onSubmit({ ...data, format, enum: enumValue, target: modelField });
    })();
  }, [
    handleSubmit,
    modelField,
    onSubmit,
    projectEnumerations,
    projectModels,
    trigger,
  ]);

  const fieldNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSubmitting) {
      const nameInput = fieldNameInputRef.current;
      return () => {
        // form의 값이 초기로 돌아가는 현상이 있어서 직접 리셋해줌
        reset(!modelField ? undefined : getValues());
        nameInput?.focus();
      };
    }
  }, [getValues, isSubmitting, modelField, reset]);

  const handleOnCancel = useCallback(() => {
    onCancel();
    reset(); // 폼의 변경사항들을 되돌림
  }, [onCancel, reset]);

  const showForm = useCallback(
    (focusField) => {
      onClickCell?.();
      setAutoFocusField(focusField);
    },
    [onClickCell]
  );

  const createCellClickHandler = useCallback(
    (focusField) => {
      return !isFormVisible ? () => showForm(focusField) : undefined;
    },
    [isFormVisible, showForm]
  );

  const handleOnPressKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleOnSubmit();
      } else if (e.key === "Escape") {
        if (isFormVisible) {
          // 새로운 필드를 추가중이 아닐 때에는 ModelForm에 이벤트 전파 하지 않음
          e.stopPropagation();
        }
        handleOnCancel();
      }
    },
    [handleOnCancel, handleOnSubmit, isFormVisible]
  );

  useEffect(() => {
    if (isFormVisible) {
      document.addEventListener("keyup", handleOnPressKey);
      return () => {
        document.removeEventListener("keyup", handleOnPressKey);
      };
    }
  }, [handleOnPressKey, isFormVisible]);

  const indentionPadding = useMemo(() => {
    return getIntentionPaddingByDepth(depth);
  }, [depth]);

  const subModelId = useMemo(() => {
    return modelField?.format.value;
  }, [modelField]);

  const objectFormatDefaultValue = useMemo(() => {
    if (watchedFieldType !== FIELD_TYPE.OBJECT) {
      return FORMAT.NEW_MODEL;
    } else if (modelField?.format) {
      return (
        projectModels.find((item) => item.id === modelField.format.value)
          ?.name || FORMAT.NEW_MODEL
      );
    } else {
      return FORMAT.NEW_MODEL;
    }
  }, [modelField, projectModels, watchedFieldType]);

  const enumOptions = useMemo(() => {
    return [
      "없음",
      ...projectEnumerations
        .filter((item) => item.fieldType === watchedFieldType)
        .map((item) => item.name),
    ];
  }, [projectEnumerations, watchedFieldType]);

  const enumDefaultValue = useMemo(() => {
    return (
      projectEnumerations.find((item) => item.id === modelField?.enum.value)
        ?.name || "없음"
    );
  }, [modelField, projectEnumerations]);

  return (
    <>
      <TableRow>
        <TableCell
          onClick={createCellClickHandler("fieldName")}
          style={{ paddingLeft: indentionPadding }}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="fieldName"
              defaultValue={defaultValues.fieldName}
              rules={{
                required: "필드명을 입력해주세요.",
                maxLength: {
                  value: 40,
                  message: "필드명이 너무 길어요.",
                },
                validate: (data: string) => {
                  const isDup = modelFields
                    .filter(
                      // 현재 수정중인 필드는 제외
                      (item) =>
                        item.fieldName.value !== defaultValues?.fieldName
                    )
                    .some((modelField) => modelField.fieldName.value === data);
                  return isDup ? "중복되는 필드가 있어요." : true;
                },
                pattern: patterns.wordsWithNoSpace,
              }}
              render={(props) => {
                return (
                  <TextField
                    {...props}
                    inputRef={fieldNameInputRef}
                    size="small"
                    autoFocus={autoFocusField === "fieldName"}
                    fullWidth
                    required
                    error={!!errors.fieldName}
                    helperText={errors.fieldName?.message}
                    placeholder="필드명"
                  />
                );
              }}
            />
          ) : (
            modelField?.fieldName.value
          )}
        </TableCell>
        <TableCell
          align="center"
          onClick={createCellClickHandler("isRequired")}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="isRequired"
              render={(props) => (
                <Checkbox
                  {...props}
                  autoFocus={autoFocusField === "isRequired"}
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
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
                  checked={props.value}
                  onChange={(e) => props.onChange(e.target.checked)}
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
              defaultValue={
                watchedFieldType === FIELD_TYPE.OBJECT
                  ? objectFormatDefaultValue
                  : defaultValues.format || formatOptions[0]
              }
              render={({ value }) => {
                return (
                  <Autocomplete
                    value={value}
                    openOnFocus
                    className={classes.autocomplete}
                    options={formatOptions}
                    onChange={(_e, value) => {
                      setValue("format", value, { shouldValidate: true });
                    }}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        autoFocus={autoFocusField === "format"}
                        placeholder="포맷"
                      />
                    )}
                  />
                );
              }}
            />
          ) : watchedFieldType === FIELD_TYPE.OBJECT ? (
            objectFormatDefaultValue
          ) : (
            modelField?.format.value
          )}
        </TableCell>
        <TableCell onClick={createCellClickHandler("enum")}>
          {isFormVisible ? (
            <Controller
              control={control}
              name="enum"
              defaultValue={enumDefaultValue}
              render={({ value }) => {
                return (
                  <Autocomplete
                    value={value}
                    openOnFocus
                    className={classes.autocomplete}
                    options={enumOptions}
                    onChange={(_e, value) => {
                      setValue("enum", value, { shouldValidate: true });
                    }}
                    disableClearable
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        autoFocus={autoFocusField === "enum"}
                        placeholder="열거형"
                      />
                    )}
                  />
                );
              }}
            />
          ) : (
            enumDefaultValue
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
            <Box>
              <IconButton onClick={handleOnSubmit}>
                <SvgIcon fontSize="small">
                  <CheckIcon />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnCancel}>
                <SvgIcon fontSize="small">
                  <ClearIcon />
                </SvgIcon>
              </IconButton>
            </Box>
          ) : (
            <IconButton onClick={onDelete}>
              <SvgIcon fontSize="small">
                <DeleteOutlineIcon />
              </SvgIcon>
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {!isFormVisible && (
        <SubModelForm
          fieldType={watchedFieldType}
          subModelId={subModelId}
          depth={depth}
        />
      )}
    </>
  );
};

interface SubModelFormProps {
  fieldType: string;
  subModelId?: string;
  depth?: number;
}

const SubModelForm: React.FC<SubModelFormProps> = ({
  fieldType,
  subModelId,
  depth,
}) => {
  switch (fieldType) {
    case FIELD_TYPE.OBJECT:
      return <ModelForm depth={(depth || 1) + 1} defaultModelId={subModelId} />;
    // return subModelId ? (
    //   <ModelForm depth={(depth || 1) + 1} defaultModelId={subModelId} />
    // ) : null;
    default:
      return null;
  }
};

export default ModelFormItem;
