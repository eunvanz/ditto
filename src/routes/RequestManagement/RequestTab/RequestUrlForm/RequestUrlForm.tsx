import { Box, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import QuickUrlFormModal from "../../../../components/QuickUrlFormModal";
import { regExps } from "../../../../helpers/commonHelpers";
import { Theme } from "../../../../theme";
import {
  BASE_URL,
  ProjectUrlDoc,
  RequestDoc,
  REQUEST_METHOD,
} from "../../../../types";

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

const methodOptions = [
  REQUEST_METHOD.NONE,
  REQUEST_METHOD.GET,
  REQUEST_METHOD.POST,
  REQUEST_METHOD.PUT,
  REQUEST_METHOD.PATCH,
  REQUEST_METHOD.DELETE,
];

export interface RequestUrlFormProps {
  onSubmit: (values: RequestUrlFormValues) => void;
  request: RequestDoc;
  baseUrls: ProjectUrlDoc[];
}

export interface RequestUrlFormValues {
  method: REQUEST_METHOD;
  baseUrl: string;
  path: string;
}

const RequestUrlForm: React.FC<RequestUrlFormProps> = ({
  onSubmit,
  request,
  baseUrls,
}) => {
  const classes = useStyles();

  const defaultValues = useMemo(() => {
    return {
      method: request.method || REQUEST_METHOD.NONE,
      baseUrl: request.baseUrl || BASE_URL.NONE,
      path: request.path || "",
    };
  }, [request.baseUrl, request.method, request.path]);

  const { register, handleSubmit, watch, errors, trigger } = useForm<
    RequestUrlFormValues
  >({
    mode: "onChange",
    defaultValues,
  });

  const watchedBaseUrl = watch("baseUrl");

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
      ? "베이스URL을 선택해주세요"
      : `${baseUrls.find((item) => item.id === watchedBaseUrl)?.url}/`;
  }, [baseUrls, watchedBaseUrl]);

  const validateAndSubmit = useCallback(async () => {
    trigger();
    await handleSubmit((data) => {
      onSubmit(data);
    })();
  }, [handleSubmit, onSubmit, trigger]);

  return (
    <Box p={2}>
      <form onSubmit={validateAndSubmit}>
        <Box display="flex" alignItems="center">
          <TextField
            label="메소드"
            name="method"
            select
            variant="outlined"
            inputRef={register()}
            className={classes.methodField}
            SelectProps={{ native: true }}
            onChange={validateAndSubmit}
          >
            {methodOptions.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </TextField>
          <TextField
            label="베이스URL"
            name="baseUrl"
            select
            variant="outlined"
            inputRef={register()}
            className={classes.baseUrlField}
            SelectProps={{ native: true }}
            onChange={validateAndSubmit}
          >
            {baseUrlOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </TextField>
          <TextField
            label="URL"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{urlPrefix}</InputAdornment>
              ),
            }}
            name="path"
            variant="outlined"
            inputRef={register({
              validate: (data: string) => {
                const fullUrl = `${urlPrefix}${data}`;
                const isValidUrl = regExps.pathParamUrl.test(fullUrl);
                const braceRemovedUrl = fullUrl.replace(/{[a-zA-Z]+}/g, "");
                const isParamWrappedProperly = regExps.url.test(
                  braceRemovedUrl
                );
                return !isValidUrl
                  ? "URL형식에 맞지 않아요."
                  : isParamWrappedProperly ||
                      "패스 파라미터를 '{}'로 감싸주세요.";
              },
            })}
            className={classes.pathField}
            placeholder="user/{userId}"
            error={!!errors.path}
            helperText={errors.path?.message}
            onBlur={validateAndSubmit}
          />
        </Box>
      </form>
      <QuickUrlFormModal />
    </Box>
  );
};

export default RequestUrlForm;
