import {
  Box,
  IconButton,
  makeStyles,
  SvgIcon,
  TableCell,
  TableRow,
  TextField,
} from "@material-ui/core";
import { Check, Clear, DeleteOutline } from "@material-ui/icons";
import { Autocomplete } from "@material-ui/lab";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  getTextFieldErrorProps,
  mediaTypes,
} from "../../../helpers/projectHelpers";
import {
  ENUMERATION,
  EnumerationDoc,
  fieldTypes,
  FIELD_TYPE,
  FORMAT,
  formats,
  ModelDoc,
  RequestBodyDoc,
} from "../../../types";

const useStyles = makeStyles(() => ({
  autocomplete: {
    "& .MuiAutocomplete-inputRoot": {
      paddingBottom: 0,
    },
  },
}));

export interface RequestBodyFormItemProps {
  /**
   * 미디어타입 validation에 필요한 requestBodies
   */
  requestBodies: RequestBodyDoc[];
  requestBody?: RequestBodyDoc;
  onSubmit: (values: RequestBodyItemFormValues) => void;
  onDelete: () => void;
  projectModels: ModelDoc[];
  projectEnumerations: EnumerationDoc[];
  isSubmitting: boolean;
  isNewForm?: boolean;
  onHideForm?: () => void;
}

export interface RequestBodyItemFormValues {
  mediaType: string;
  type: string;
  format: string;
  enum: string;
  description: string;
  target?: RequestBodyDoc;
}

const RequestBodyFormItem: React.FC<RequestBodyFormItemProps> = ({
  requestBodies,
  requestBody,
  onSubmit,
  onDelete,
  projectModels,
  isSubmitting,
  isNewForm,
  projectEnumerations,
  onHideForm,
}) => {
  const classes = useStyles();

  const getFormatValue = useCallback(
    (format: string) => {
      return (
        projectModels.find((model) => model.id === format)?.name ||
        FORMAT.NEW_MODEL
      );
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

  const defaultValues = useMemo(() => {
    return {
      mediaType: requestBody?.mediaType || "",
      type: requestBody?.type || FIELD_TYPE.OBJECT,
      format: requestBody?.format
        ? getFormatValue(requestBody.format)
        : FORMAT.NEW_MODEL,
      enum: requestBody ? getEnumValue(requestBody.enum) : ENUMERATION.NONE,
      description: requestBody?.description || "",
    };
  }, [getEnumValue, getFormatValue, requestBody]);

  const {
    control,
    setValue,
    errors,
    watch,
    reset,
    handleSubmit,
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const [isFormVisible, setIsFormVisible] = useState(isNewForm);
  const [autoFocusField, setAutoFocusField] = useState<
    keyof RequestBodyItemFormValues
  >("mediaType");

  const showForm = useCallback(
    (focusField: keyof RequestBodyItemFormValues) => {
      setAutoFocusField(focusField);
      setIsFormVisible(true);
    },
    []
  );

  const createCellClickHandler = useCallback(
    (focusField: keyof RequestBodyItemFormValues) => {
      return !isFormVisible ? () => showForm(focusField) : undefined;
    },
    [isFormVisible, showForm]
  );

  const [isDisabledEnterSubmit, setIsDisabledEnterSubmit] = useState<boolean>(
    false
  );

  const watchedType = watch("type");

  const formatOptions = useMemo(() => {
    switch (watchedType) {
      case FIELD_TYPE.BOOLEAN:
      case FIELD_TYPE.INTEGER:
      case FIELD_TYPE.NUMBER:
      case FIELD_TYPE.STRING:
        return formats[watchedType as FIELD_TYPE];
      case FIELD_TYPE.OBJECT:
        return [FORMAT.NEW_MODEL, ...projectModels.map((model) => model.name)];
      default:
        return [ENUMERATION.NONE];
    }
  }, [projectModels, watchedType]);

  const objectFormatDefaultValue = useMemo(() => {
    if (watchedType !== FIELD_TYPE.OBJECT) {
      return FORMAT.NEW_MODEL;
    } else if (requestBody?.format) {
      return (
        projectModels.find((item) => item.id === requestBody.format)?.name ||
        FORMAT.NEW_MODEL
      );
    } else {
      return FORMAT.NEW_MODEL;
    }
  }, [projectModels, requestBody, watchedType]);

  const handleOnSubmit = useCallback(async () => {
    trigger();
    await handleSubmit((data) => {
      const format =
        data.type === FIELD_TYPE.OBJECT
          ? projectModels.find((model) => model.name === data.format)?.id ||
            FORMAT.NEW_MODEL
          : data.format;
      const enumValue =
        projectEnumerations.find(
          (enumeration) => enumeration.name === data.enum
        )?.id || data.enum;
      onSubmit({ ...data, format, enum: enumValue, target: requestBody });
    })();
  }, [
    handleSubmit,
    onSubmit,
    projectEnumerations,
    projectModels,
    requestBody,
    trigger,
  ]);

  const mediaTypeInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSubmitting) {
      const nameInput = mediaTypeInputRef.current;
      return () => {
        // form의 값이 초기로 돌아가는 현상이 있어서 직접 리셋해줌
        // FIXME: 새로운 필드를 만들고 나서 <-> enum 혹은 object 퀵모달을 띄웠다가 취소했을 시 상충되는 이슈가 있음. 구분할 방법이 필요
        reset(!requestBody ? undefined : getValues());
        nameInput?.focus();
        onHideForm?.();
      };
    }
  }, [getValues, isSubmitting, onHideForm, requestBody, reset]);

  const handleOnCancel = useCallback(() => {
    reset(defaultValues); // 폼의 변경사항들을 되돌림
    setIsFormVisible(false);
    onHideForm?.();
  }, [defaultValues, onHideForm, reset]);

  const enumOptions = useMemo(() => {
    const result = [
      ENUMERATION.NONE,
      [FIELD_TYPE.INTEGER, FIELD_TYPE.STRING].includes(watchedType)
        ? ENUMERATION.NEW
        : undefined,
      ...projectEnumerations
        .filter((item) => item.fieldType === watchedType)
        .map((item) => item.name),
    ];
    return result.filter((item) => !!item);
  }, [projectEnumerations, watchedType]);

  const enumDefaultValue = useMemo(() => {
    return (
      projectEnumerations.find((item) => item.id === requestBody?.enum)?.name ||
      ENUMERATION.NONE
    );
  }, [requestBody, projectEnumerations]);

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

  return (
    <>
      <TableRow>
        <TableCell onClick={createCellClickHandler("mediaType")}>
          {isFormVisible ? (
            <Controller
              control={control}
              name="mediaType"
              defaultValue={defaultValues.mediaType}
              rules={{
                required: "Media-type is required.",
                validate: (data: string) => {
                  const isDup = requestBodies
                    .filter((item) => item.id !== requestBody?.id)
                    .some((item) => item.mediaType === data);
                  return isDup ? "Media-type is duplicated." : true;
                },
              }}
              render={({ value }) => (
                <Autocomplete
                  value={value}
                  openOnFocus
                  className={classes.autocomplete}
                  options={mediaTypes}
                  onChange={(_e, value) => {
                    setValue("mediaType", value, { shouldValidate: true });
                  }}
                  freeSolo
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        inputRef={mediaTypeInputRef}
                        required
                        placeholder="Media-type"
                        autoFocus={autoFocusField === "mediaType"}
                        {...getTextFieldErrorProps(errors.mediaType)}
                      />
                    );
                  }}
                  onFocus={() => setIsDisabledEnterSubmit(true)}
                  onBlur={() => setIsDisabledEnterSubmit(false)}
                  size="small"
                />
              )}
            />
          ) : (
            requestBody?.mediaType
          )}
        </TableCell>
        <TableCell onClick={createCellClickHandler("type")}>
          {isFormVisible ? (
            <Controller
              control={control}
              name="type"
              defaultValue={defaultValues.type}
              rules={{ required: "Type must be selected." }}
              render={({ value }) => {
                return (
                  <Autocomplete
                    value={value}
                    openOnFocus
                    className={classes.autocomplete}
                    options={fieldTypes}
                    onChange={(_e, value) => {
                      setValue("type", value, { shouldValidate: true });
                    }}
                    disableClearable
                    renderInput={(params) => {
                      return (
                        <TextField
                          {...params}
                          required
                          placeholder="Type"
                          autoFocus={autoFocusField === "type"}
                          {...getTextFieldErrorProps(errors.type)}
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
            requestBody?.type
          )}
        </TableCell>
        <TableCell onClick={createCellClickHandler("format")}>
          {isFormVisible ? (
            <Controller
              control={control}
              name="format"
              defaultValue={
                watchedType === FIELD_TYPE.OBJECT
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
                        {...getTextFieldErrorProps(errors.format)}
                      />
                    )}
                    onFocus={() => setIsDisabledEnterSubmit(true)}
                    onBlur={() => setIsDisabledEnterSubmit(false)}
                    size="small"
                  />
                );
              }}
            />
          ) : watchedType === FIELD_TYPE.OBJECT ? (
            objectFormatDefaultValue
          ) : requestBody?.format === FORMAT.NONE ? (
            "-"
          ) : (
            requestBody?.format
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
                  message: "Description is too long.",
                },
              }}
              render={(props) => (
                <TextField
                  {...props}
                  size="small"
                  autoFocus={autoFocusField === "description"}
                  fullWidth
                  {...getTextFieldErrorProps(errors.description)}
                  placeholder="Description"
                />
              )}
            />
          ) : (
            requestBody?.description
          )}
        </TableCell>
        <TableCell align="right">
          {isFormVisible ? (
            <Box>
              <IconButton onClick={handleOnSubmit}>
                <SvgIcon fontSize="small">
                  <Check />
                </SvgIcon>
              </IconButton>
              <IconButton onClick={handleOnCancel}>
                <SvgIcon fontSize="small">
                  <Clear />
                </SvgIcon>
              </IconButton>
            </Box>
          ) : (
            <IconButton onClick={onDelete}>
              <SvgIcon fontSize="small">
                <DeleteOutline />
              </SvgIcon>
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default RequestBodyFormItem;
