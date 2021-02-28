import { makeStyles, TableCell, TableRow, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  getTextFieldErrorProps,
  mediaTypes,
} from "../../helpers/projectHelpers";
import {
  ENUMERATION,
  EnumerationDoc,
  fieldTypes,
  FIELD_TYPE,
  FORMAT,
  formats,
  ModelDoc,
  RequestBodyDoc,
} from "../../types";

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
}

export interface RequestBodyItemFormValues {
  mediaType: string;
  type: string;
  format: string;
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

  const defaultValues = useMemo(() => {
    return {
      mediaType: requestBody?.mediaType || "",
      type: requestBody?.type || FIELD_TYPE.OBJECT,
      format: requestBody?.format
        ? getFormatValue(requestBody.format)
        : FORMAT.NEW_MODEL,
      description: requestBody?.description || "",
    };
  }, [getFormatValue, requestBody]);

  const { control, setValue, errors, watch } = useForm({
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

  return (
    <>
      <TableRow>
        <TableCell onClick={createCellClickHandler("mediaType")}>
          {isFormVisible ? (
            <Controller
              control={control}
              name="mediaType"
              defaultValue={defaultValues.mediaType}
              rules={{ required: "Media type is required." }}
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
                        required
                        placeholder="Media type"
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
      </TableRow>
    </>
  );
};

export default RequestBodyFormItem;
