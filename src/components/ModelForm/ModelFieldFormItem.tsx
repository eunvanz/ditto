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
  ENUMERATION,
} from "../../types";
import {
  getIntentionPaddingByDepth,
  patterns,
} from "../../helpers/projectHelpers";
import { ModelTableColumns } from "../ModelTable/ModelTable";

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
  hiddenColumns?: ModelTableColumns[];
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
  hiddenColumns,
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
          ?.name || ENUMERATION.NONE
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
        : FORMAT.NONE,
      enum: modelField ? getEnumValue(modelField.enum.value) : ENUMERATION.NONE,
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
        return [ENUMERATION.NONE];
    }
  }, [projectModels, watchedFieldType]);

  useEffect(() => {
    const format =
      modelField && modelField.fieldType.value === watchedFieldType
        ? getFormatValue(watchedFieldType, modelField?.format.value)
        : formatOptions[0];
    setValue("format", format, { shouldValidate: true });
    setValue("enum", ENUMERATION.NONE, { shouldValidate: true });
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
        )?.id || data.enum;
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
        // FIXME: 새로운 필드를 만들고 나서 <-> enum 혹은 object 퀵모달을 띄웠다가 취소했을 시 상충되는 이슈가 있음. 구분할 방법이 필요
        reset(!modelField ? undefined : getValues());
        nameInput?.focus();
      };
    }
  }, [getValues, isSubmitting, modelField, reset]);

  const handleOnCancel = useCallback(() => {
    onCancel();
    reset(defaultValues); // 폼의 변경사항들을 되돌림
  }, [defaultValues, onCancel, reset]);

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

  const [isDisabledEnterSubmit, setIsDisabledEnterSubmit] = useState<boolean>(
    false
  );

  const handleOnPressKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        !isDisabledEnterSubmit && handleOnSubmit();
      } else if (e.key === "Escape") {
        !isSubmitting && handleOnCancel();
      }
    },
    [handleOnCancel, handleOnSubmit, isDisabledEnterSubmit, isSubmitting]
  );

  useEffect(() => {
    if (isFormVisible) {
      document.addEventListener("keydown", handleOnPressKey);
      return () => {
        document.removeEventListener("keydown", handleOnPressKey);
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
    const result = [
      ENUMERATION.NONE,
      [FIELD_TYPE.INTEGER, FIELD_TYPE.STRING].includes(watchedFieldType)
        ? ENUMERATION.NEW
        : undefined,
      ...projectEnumerations
        .filter((item) => item.fieldType === watchedFieldType)
        .map((item) => item.name),
    ];
    return result.filter((item) => !!item);
  }, [projectEnumerations, watchedFieldType]);

  const enumDefaultValue = useMemo(() => {
    return (
      projectEnumerations.find((item) => item.id === modelField?.enum.value)
        ?.name || ENUMERATION.NONE
    );
  }, [modelField, projectEnumerations]);

  const getHiddenColumnStyle = useCallback(
    (column: ModelTableColumns) => {
      if (hiddenColumns?.includes(column)) {
        return { display: "none" };
      } else {
        return undefined;
      }
    },
    [hiddenColumns]
  );

  return (
    <>
      <TableRow>
        <TableCell
          onClick={createCellClickHandler("fieldName")}
          style={{
            ...getHiddenColumnStyle("fieldName"),
            paddingLeft: indentionPadding,
          }}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="fieldName"
              defaultValue={defaultValues.fieldName}
              rules={{
                required: "Field name is required.",
                maxLength: {
                  value: 40,
                  message: "Field name is too long.",
                },
                validate: (data: string) => {
                  const isDup = modelFields
                    .filter(
                      // 현재 수정중인 필드는 제외
                      (item) =>
                        item.fieldName.value !== defaultValues?.fieldName
                    )
                    .some((modelField) => modelField.fieldName.value === data);
                  return isDup ? "Field name is duplicated." : true;
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
                    placeholder="Field name"
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
          style={getHiddenColumnStyle("isRequired")}
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
        <TableCell
          align="center"
          onClick={createCellClickHandler("isArray")}
          style={getHiddenColumnStyle("isArray")}
        >
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
        <TableCell
          onClick={createCellClickHandler("fieldType")}
          style={getHiddenColumnStyle("fieldType")}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="fieldType"
              defaultValue={defaultValues.fieldType}
              rules={{ required: "Type must be selected." }}
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
                          placeholder="Type"
                          autoFocus={autoFocusField === "fieldType"}
                          error={!!errors.fieldType}
                          helperText={errors.fieldType?.message}
                        />
                      );
                    }}
                    onFocus={() => setIsDisabledEnterSubmit(true)}
                    onBlur={() => setIsDisabledEnterSubmit(false)}
                  />
                );
              }}
            />
          ) : (
            modelField?.fieldType.value
          )}
        </TableCell>
        <TableCell
          onClick={createCellClickHandler("format")}
          style={getHiddenColumnStyle("format")}
        >
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
                        placeholder="Format"
                      />
                    )}
                    onFocus={() => setIsDisabledEnterSubmit(true)}
                    onBlur={() => setIsDisabledEnterSubmit(false)}
                    size="small"
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
        <TableCell
          onClick={createCellClickHandler("enum")}
          style={getHiddenColumnStyle("enum")}
        >
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
                        placeholder="Enumerations"
                      />
                    )}
                    onFocus={() => setIsDisabledEnterSubmit(true)}
                    onBlur={() => setIsDisabledEnterSubmit(false)}
                  />
                );
              }}
            />
          ) : (
            enumDefaultValue
          )}
        </TableCell>
        <TableCell
          onClick={createCellClickHandler("description")}
          style={getHiddenColumnStyle("description")}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="description"
              defaultValue={defaultValues.description}
              rules={{
                maxLength: {
                  value: 200,
                  message: "Description is too long.",
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
                  placeholder="Description"
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
