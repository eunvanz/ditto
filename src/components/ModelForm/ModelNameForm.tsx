import React, { useCallback, useMemo } from "react";
import { CardContent, Grid, TextField, makeStyles } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { ModelDoc } from "../../types";
import { patterns } from "../../helpers/projectHelpers";
import { isEqual } from "lodash";

const useStyles = makeStyles(() => ({
  submit: {
    display: "none",
  },
}));

export interface ModelNameFormValues {
  name: string;
  description: string;
  target?: ModelDoc;
}

export interface ModelNameFormProps {
  model?: ModelDoc;
  nameInputRef: React.MutableRefObject<any>;
  isCancelingRef: React.MutableRefObject<boolean>;
  onSubmit: (data: ModelNameFormValues) => void;
  existingModelNames: string[];
}

const ModelNameForm: React.FC<ModelNameFormProps> = ({
  model,
  nameInputRef,
  isCancelingRef,
  onSubmit,
  existingModelNames,
}) => {
  const classes = useStyles();

  const defaultValues = useMemo(() => {
    return {
      name: model?.name || "",
      description: model?.description || "",
    };
  }, [model]);

  const { register, errors, handleSubmit, getValues } = useForm({
    mode: "onChange",
    defaultValues,
  });

  const submit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      // @ts-ignore
      handleSubmit(() =>
        onSubmit({
          ...(getValues() as ModelNameFormValues),
          target: model,
        })
      )();
    },
    [getValues, handleSubmit, model, onSubmit]
  );

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      if (isCancelingRef.current) {
        return;
      }
      if (!isEqual(getValues(), defaultValues)) {
        submit();
      }
    }, 100); // isCancelingRef.current를 인식하는 타이밍을 맞추기 위해
  }, [defaultValues, getValues, isCancelingRef, submit]);

  return (
    <form onSubmit={submit} noValidate>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item sm={5}>
            <TextField
              label="Model name"
              autoFocus={!model}
              name="name"
              inputRef={(e) => {
                nameInputRef.current = e;
                register(e, {
                  required: "Name is required.",
                  maxLength: {
                    value: 40,
                    message: "Name is too long.",
                  },
                  validate: (data: string) => {
                    const isDup = existingModelNames.some(
                      (item) => item === data
                    );
                    return isDup ? "Name is duplicated." : true;
                  },
                  pattern: patterns.wordsWithNoSpace,
                });
              }}
              variant="outlined"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name?.message}
              size="small"
              onBlur={handleOnBlur}
            />
          </Grid>
          <Grid item sm={7}>
            <TextField
              label="설명"
              name="description"
              inputRef={register({
                maxLength: {
                  value: 100,
                  message: "Description is too long.",
                },
              })}
              variant="outlined"
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
              size="small"
              onBlur={handleOnBlur}
            />
          </Grid>
        </Grid>
      </CardContent>
      <button className={classes.submit} type="submit" />
    </form>
  );
};

export default ModelNameForm;
