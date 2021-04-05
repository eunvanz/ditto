import React, { useMemo, useEffect, useCallback, useState, useRef } from "react";
import {
  TableCell,
  TextField,
  Box,
  makeStyles,
  Checkbox,
  IconButton,
  SvgIcon,
  TableRow,
  Tooltip,
  Button,
} from "@material-ui/core";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CheckIcon from "@material-ui/icons/Check";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import ClearIcon from "@material-ui/icons/Clear";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
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
  MemberRole,
  UserProfileDoc,
  ModelFieldKey,
} from "../../types";
import {
  checkHasAuthorization,
  commonStyles,
  getIndentionPaddingByDepth,
  patterns,
} from "../../helpers/projectHelpers";
import isEqual from "lodash/isEqual";
import useSyncDefaultValues from "../../hooks/useSyncDefaultValues";
import { EXAMPLE_PROJECT_ID } from "../../constants";
import { EditOutlined } from "@material-ui/icons";
import { Theme } from "../../theme";

export type ModelFieldColumns =
  | "fieldName"
  | "isRequired"
  | "isArray"
  | "fieldType"
  | "format"
  | "enum"
  | "description";

const useStyles = makeStyles((theme: Theme) => ({
  autocomplete: {
    "& .MuiAutocomplete-inputRoot": {
      paddingBottom: 0,
    },
  },
  enumerationTooltip: {
    fontSize: "0.875rem",
    fontWeight: "normal",
  },
  enumerationButton: {
    fontSize: "0.875rem",
    fontWeight: "normal",
    textTransform: "unset",
  },
  updated: commonStyles.updatedFieldCell,
  subButton: {
    marginLeft: 2,
    color: theme.palette.text.secondary,
    padding: 0,
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
  disabledColumns?: ModelFieldColumns[];
  customFieldName?: string;
  customFieldNameInput?: (props: {
    renderProps: ControllerRenderProps<Record<string, any>>;
    setValue: any;
    autoFocusField: any;
    inputRef: React.MutableRefObject<HTMLInputElement | null>;
    errors: any;
    setIsDisabledEnterSubmit: any;
  }) => JSX.Element;
  role: MemberRole;
  userProfile: UserProfileDoc;
  onRefreshModelField: (modelField: ModelFieldDoc) => void;
  onShowQuickEnumFormModal: (enumeration: EnumerationDoc) => void;
  isExampleAvailable?: boolean;
  onClickExample?: (modelField: ModelFieldDoc) => void;
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
  disabledColumns,
  customFieldName,
  customFieldNameInput,
  role,
  userProfile,
  onRefreshModelField,
  onShowQuickEnumFormModal,
  isExampleAvailable = false,
  onClickExample,
}) => {
  const classes = useStyles();

  const getFormatValue = useCallback(
    (fieldType: string, format: string) => {
      if (fieldType === FIELD_TYPE.OBJECT) {
        return (
          projectModels.find((model) => model.id === format)?.name || FORMAT.NEW_MODEL
        );
      } else {
        return format;
      }
    },
    [projectModels],
  );

  const getEnumValue = useCallback(
    (enumId: string) => {
      return (
        projectEnumerations.find((enumeration) => enumeration.id === enumId)?.name ||
        ENUMERATION.NONE
      );
    },
    [projectEnumerations],
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

  const [autoFocusField, setAutoFocusField] = useState<keyof ModelFieldFormValues>(
    "fieldName",
  );

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

  useSyncDefaultValues(reset, defaultValues);

  const watchedValues = watch();

  const watchedFieldType = watchedValues.fieldType;

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
    if (isEqual(watchedValues, defaultValues)) {
      return onCancel();
    }
    trigger();
    await handleSubmit((data) => {
      const format =
        data.fieldType === FIELD_TYPE.OBJECT
          ? projectModels.find((model) => model.name === data.format)?.id ||
            FORMAT.NEW_MODEL
          : data.format;
      const enumValue =
        projectEnumerations.find((enumeration) => enumeration.name === data.enum)?.id ||
        data.enum;
      onSubmit({ ...data, format, enum: enumValue, target: modelField });
    })();
  }, [
    defaultValues,
    handleSubmit,
    modelField,
    onCancel,
    onSubmit,
    projectEnumerations,
    projectModels,
    trigger,
    watchedValues,
  ]);

  const fieldNameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSubmitting) {
      const nameInput = fieldNameInputRef.current;
      return () => {
        // form의 값이 초기로 돌아가는 현상이 있어서 직접 리셋해줌
        // FIXME: 새로운 필드를 만들고 나서 <-> enum 혹은 object 퀵모달을 띄웠다가 취소했을 시 상충되는 이슈가 있음. 구분할 방법이 필요
        reset(!modelField ? undefined : getValues());
        // setTimeout(nameInput?.focus, 500);
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
    [onClickCell],
  );

  const createCellClickHandler = useCallback(
    (focusField) => {
      return !isFormVisible ? () => showForm(focusField) : undefined;
    },
    [isFormVisible, showForm],
  );

  const [isDisabledEnterSubmit, setIsDisabledEnterSubmit] = useState<boolean>(false);

  const handleOnPressKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        !isDisabledEnterSubmit && handleOnSubmit();
      } else if (e.key === "Escape") {
        !isSubmitting && handleOnCancel();
      }
    },
    [handleOnCancel, handleOnSubmit, isDisabledEnterSubmit, isSubmitting],
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
    return getIndentionPaddingByDepth(depth);
  }, [depth]);

  const subModelId = useMemo(() => {
    return modelField?.format.value;
  }, [modelField]);

  const objectFormatDefaultValue = useMemo(() => {
    if (
      watchedFieldType
        ? watchedFieldType !== FIELD_TYPE.OBJECT
        : defaultValues.fieldType !== FIELD_TYPE.OBJECT
    ) {
      return FORMAT.NEW_MODEL;
    } else if (modelField?.format) {
      return (
        projectModels.find((item) => item.id === modelField.format.value)?.name ||
        FORMAT.NEW_MODEL
      );
    } else {
      return FORMAT.NEW_MODEL;
    }
  }, [defaultValues.fieldType, modelField, projectModels, watchedFieldType]);

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

  const currentEnumeration = useMemo(() => {
    return projectEnumerations.find((item) => item.id === modelField?.enum.value);
  }, [modelField, projectEnumerations]);

  const enumDefaultValue = useMemo(() => {
    return currentEnumeration?.name || ENUMERATION.NONE;
  }, [currentEnumeration]);

  const checkIsColumnDisabled = useCallback(
    (name: ModelFieldColumns) => {
      return disabledColumns?.includes(name);
    },
    [disabledColumns],
  );

  const enumValues = useMemo(() => {
    return currentEnumeration?.items.join(", ");
  }, [currentEnumeration]);

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

  const checkIsUpdatedFieldKey = useCallback(
    (key: ModelFieldKey) => {
      if (modelField && modelField.projectId !== EXAMPLE_PROJECT_ID) {
        return (
          modelField[key].value !==
          modelField[key].settingsByMember?.[userProfile.uid]?.value
        );
      } else {
        return false;
      }
    },
    [modelField, userProfile.uid],
  );

  useEffect(() => {
    return () => {
      modelField &&
        modelField.projectId !== EXAMPLE_PROJECT_ID &&
        onRefreshModelField(modelField);
    };
    // eslint-disable-next-line
  }, []);

  const isExampleButtonVisible = useMemo(() => {
    return (
      isExampleAvailable &&
      onClickExample &&
      modelField &&
      modelField.enum.value === ENUMERATION.NONE &&
      [FIELD_TYPE.STRING, FIELD_TYPE.INTEGER, FIELD_TYPE.NUMBER].includes(
        modelField.fieldType.value,
      )
    );
  }, [isExampleAvailable, modelField, onClickExample]);

  return (
    <>
      <TableRow>
        <TableCell
          onClick={createCellClickHandler("fieldName")}
          style={{
            paddingLeft: indentionPadding,
          }}
          className={checkIsUpdatedFieldKey("fieldName") ? classes.updated : undefined}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="fieldName"
              defaultValue={defaultValues.fieldName}
              rules={{
                required: `${customFieldName || "Field name"} is required.`,
                maxLength: {
                  value: 40,
                  message: `${customFieldName || "Field name"} is too long.`,
                },
                validate: (data: string) => {
                  const isDup = modelFields
                    .filter(
                      // 현재 수정중인 필드는 제외
                      (item) => item.fieldName.value !== defaultValues?.fieldName,
                    )
                    .some((modelField) => modelField.fieldName.value === data);
                  return isDup
                    ? `${customFieldName || "Field name"} is duplicated.`
                    : true;
                },
                pattern: patterns.wordsWithNoSpace,
              }}
              render={(props) => {
                if (customFieldNameInput) {
                  return customFieldNameInput({
                    renderProps: props,
                    setValue,
                    autoFocusField,
                    inputRef: fieldNameInputRef,
                    errors,
                    setIsDisabledEnterSubmit,
                  });
                } else {
                  return (
                    <TextField
                      {...props}
                      inputRef={fieldNameInputRef}
                      size="small"
                      autoFocus={
                        !checkIsColumnDisabled("fieldName") &&
                        autoFocusField === "fieldName"
                      }
                      disabled={checkIsColumnDisabled("fieldName")}
                      fullWidth
                      required
                      error={!!errors.fieldName}
                      helperText={errors.fieldName?.message}
                      placeholder={customFieldName || "Field name"}
                    />
                  );
                }
              }}
            />
          ) : (
            modelField?.fieldName.value
          )}
        </TableCell>
        <TableCell
          align="center"
          onClick={createCellClickHandler("isRequired")}
          className={checkIsUpdatedFieldKey("isRequired") ? classes.updated : undefined}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="isRequired"
              defaultValue={defaultValues.isRequired}
              render={(props) => (
                <Checkbox
                  {...props}
                  autoFocus={
                    !checkIsColumnDisabled("isRequired") &&
                    autoFocusField === "isRequired"
                  }
                  disabled={checkIsColumnDisabled("isRequired")}
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
          className={checkIsUpdatedFieldKey("isArray") ? classes.updated : undefined}
        >
          {isFormVisible ? (
            <Controller
              control={control}
              name="isArray"
              defaultValue={defaultValues.isArray}
              render={(props) => (
                <Checkbox
                  {...props}
                  autoFocus={
                    !checkIsColumnDisabled("isArray") && autoFocusField === "isArray"
                  }
                  disabled={checkIsColumnDisabled("isArray")}
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
          className={checkIsUpdatedFieldKey("fieldType") ? classes.updated : undefined}
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
                          disabled={disabledColumns?.includes("fieldType")}
                        />
                      );
                    }}
                    onFocus={() => setIsDisabledEnterSubmit(true)}
                    onBlur={() => setIsDisabledEnterSubmit(false)}
                    size="small"
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
          className={checkIsUpdatedFieldKey("format") ? classes.updated : undefined}
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
                        disabled={disabledColumns?.includes("format")}
                      />
                    )}
                    onFocus={() => setIsDisabledEnterSubmit(true)}
                    onBlur={() => setIsDisabledEnterSubmit(false)}
                    size="small"
                  />
                );
              }}
            />
          ) : (
              watchedFieldType
                ? watchedFieldType === FIELD_TYPE.OBJECT
                : defaultValues.fieldType === FIELD_TYPE.OBJECT
            ) ? (
            objectFormatDefaultValue
          ) : modelField?.format.value === FORMAT.NONE ? (
            "-"
          ) : (
            modelField?.format.value
          )}
        </TableCell>
        <TableCell
          onClick={createCellClickHandler("enum")}
          className={checkIsUpdatedFieldKey("enum") ? classes.updated : undefined}
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
                        autoFocus={
                          !checkIsColumnDisabled("enum") && autoFocusField === "enum"
                        }
                        disabled={checkIsColumnDisabled("enum")}
                        placeholder="Enumerations"
                      />
                    )}
                    onFocus={() => setIsDisabledEnterSubmit(true)}
                    onBlur={() => setIsDisabledEnterSubmit(false)}
                    size="small"
                  />
                );
              }}
            />
          ) : enumDefaultValue === ENUMERATION.NONE ? (
            "-"
          ) : (
            <Tooltip
              title={
                <span className={classes.enumerationTooltip}>{enumValues || ""}</span>
              }
              placement="top"
              arrow
            >
              <Button className={classes.enumerationButton}>
                {enumDefaultValue}
                {hasManagerAuthorization && (
                  <Button
                    size="small"
                    className={classes.subButton}
                    onClick={
                      currentEnumeration
                        ? (e) => {
                            e.stopPropagation();
                            onShowQuickEnumFormModal(currentEnumeration);
                          }
                        : undefined
                    }
                  >
                    <EditOutlined fontSize="small" />
                  </Button>
                )}
              </Button>
            </Tooltip>
          )}
        </TableCell>
        <TableCell
          onClick={createCellClickHandler("description")}
          className={checkIsUpdatedFieldKey("description") ? classes.updated : undefined}
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
                  autoFocus={
                    !checkIsColumnDisabled("description") &&
                    autoFocusField === "description"
                  }
                  disabled={checkIsColumnDisabled("description")}
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
          {hasManagerAuthorization && (
            <>
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
                <Box>
                  {isExampleButtonVisible && (
                    <IconButton onClick={() => onClickExample?.(modelField!)}>
                      <SvgIcon fontSize="small">
                        <DescriptionOutlinedIcon />
                      </SvgIcon>
                    </IconButton>
                  )}
                  <IconButton onClick={onDelete}>
                    <SvgIcon fontSize="small">
                      <DeleteOutlineIcon />
                    </SvgIcon>
                  </IconButton>
                </Box>
              )}
            </>
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

const SubModelForm: React.FC<SubModelFormProps> = ({ fieldType, subModelId, depth }) => {
  switch (fieldType) {
    case FIELD_TYPE.OBJECT:
      return <ModelForm depth={(depth || 1) + 1} defaultModelId={subModelId} />;
    default:
      return null;
  }
};

export default ModelFormItem;
