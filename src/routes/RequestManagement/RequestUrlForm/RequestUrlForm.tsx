import { Box, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import QuickUrlFormModal from "../../../components/QuickUrlFormModal";
import { regExps } from "../../../helpers/commonHelpers";
import { Theme } from "../../../theme";
import {
  BASE_URL,
  ProjectUrlDoc,
  RequestDoc,
  REQUEST_METHOD,
} from "../../../types";
import {
  getTextFieldErrorProps,
  methodOptions,
} from "../../../helpers/projectHelpers";

const useStyles = makeStyles((theme: Theme) => ({
  methodField: {
    flexBasis: 150,
  },
  baseUrlField: {
    flexBasis: 250,
    marginLeft: theme.spacing(2),
  },
  pathField: {
    width: "100%",
    marginLeft: theme.spacing(2),
  },
}));

export interface RequestUrlFormProps {
  onSubmit: (values: RequestUrlFormValues) => void;
  request: RequestDoc;
  baseUrls: ProjectUrlDoc[];
  requests: RequestDoc[];
}

export interface RequestUrlFormValues {
  method: REQUEST_METHOD;
  baseUrl: string;
  path: string;
  target?: RequestDoc;
}

const RequestUrlForm: React.FC<RequestUrlFormProps> = ({
  onSubmit,
  request,
  baseUrls,
  requests,
}) => {
  const classes = useStyles();

  const defaultValues = useMemo(() => {
    return {
      method: request.method || REQUEST_METHOD.GET,
      baseUrl: request.baseUrl || BASE_URL.NONE,
      path: request.path || "",
    };
  }, [request.baseUrl, request.method, request.path]);

  const { register, handleSubmit, watch, errors, trigger, reset } = useForm<
    RequestUrlFormValues
  >({
    mode: "onChange",
    defaultValues,
  });

  const watchedValues = watch();

  const watchedBaseUrl = watchedValues.baseUrl;

  const baseUrlOptions = useMemo(() => {
    const projectUrlOptions = baseUrls.map((baseUrl) => ({
      value: baseUrl.id,
      name: baseUrl.label,
    }));
    return [
      {
        value: BASE_URL.NONE,
        name: BASE_URL.NONE,
      },
      {
        value: BASE_URL.NEW,
        name: BASE_URL.NEW,
      },
      ...projectUrlOptions,
    ];
  }, [baseUrls]);

  const urlPrefix = useMemo(() => {
    return [BASE_URL.NONE, BASE_URL.NEW].includes(watchedBaseUrl as any)
      ? "Please select a base URL"
      : `${baseUrls.find((item) => item.id === watchedBaseUrl)?.url}/`;
  }, [baseUrls, watchedBaseUrl]);

  const validateAndSubmit = useCallback(
    async (e) => {
      if (isEqual(watchedValues, defaultValues)) {
        return;
      }
      e.preventDefault();
      trigger();
      await handleSubmit((data) => {
        onSubmit({ ...data, target: request });
      })();
    },
    [defaultValues, handleSubmit, onSubmit, request, trigger, watchedValues]
  );

  useEffect(() => {
    if (request) {
      reset(defaultValues);
    }
  }, [defaultValues, request, reset]);

  const pathInputRef = useRef<HTMLInputElement>(null);

  const checkIsDuplicatedUrl = useCallback(
    (url: string) => {
      return requests
        .filter((item) => item.id !== request.id)
        .some((item) => {
          return (
            `${item.method}${item.baseUrl}${item.path}`.replace(
              /{[a-zA-Z]+}/g,
              "{}"
            ) === url.replace(/{[a-zA-Z]+}/g, "{}")
          );
        });
    },
    [request.id, requests]
  );

  return (
    <Box p={2}>
      <form onSubmit={validateAndSubmit}>
        <Box display="flex" alignItems="center">
          <TextField
            label="Method"
            name="method"
            select
            variant="outlined"
            inputRef={register}
            className={classes.methodField}
            SelectProps={{ native: true }}
            onChange={validateAndSubmit}
            {...getTextFieldErrorProps(errors.method)}
          >
            {methodOptions.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </TextField>
          <TextField
            label="Base URL"
            name="baseUrl"
            select
            variant="outlined"
            inputRef={register}
            className={classes.baseUrlField}
            SelectProps={{ native: true }}
            onChange={validateAndSubmit}
            {...getTextFieldErrorProps(errors.baseUrl)}
          >
            {baseUrlOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="Path"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  onClick={() => pathInputRef.current?.focus()}
                >
                  {urlPrefix}
                </InputAdornment>
              ),
            }}
            name="path"
            variant="outlined"
            inputRef={(e) => {
              // @ts-ignore
              pathInputRef.current = e;
              register(e, {
                validate: (data: string) => {
                  const fullUrl = `${urlPrefix}${data}`;
                  const isValidUrl = regExps.pathParamUrl.test(fullUrl);
                  const braceRemovedUrl = fullUrl.replace(/{[a-zA-Z]+}/g, "");
                  const isParamWrappedProperly = regExps.url.test(
                    braceRemovedUrl
                  );
                  if (
                    data &&
                    watchedBaseUrl !== BASE_URL.NEW &&
                    watchedBaseUrl !== BASE_URL.NONE
                  ) {
                    if (!isValidUrl) {
                      return "URL is not valid.";
                    } else if (!isParamWrappedProperly) {
                      return "Please wrap path parameter with '{}'.";
                    }
                  }
                  if (
                    checkIsDuplicatedUrl(
                      `${watchedValues.method}${watchedValues.baseUrl}${data}`
                    )
                  ) {
                    return "URL is duplicated.";
                  }
                  if (data.endsWith("/")) {
                    return "URL cannot ends with '/'";
                  }
                  return true;
                },
              });
            }}
            className={classes.pathField}
            placeholder="user/{userId}"
            {...getTextFieldErrorProps(errors.path)}
            onBlur={validateAndSubmit}
          />
        </Box>
      </form>
      <QuickUrlFormModal />
    </Box>
  );
};

export default RequestUrlForm;
