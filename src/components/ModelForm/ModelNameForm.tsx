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
    if (isCancelingRef.current) {
      return;
    }
    if (!isEqual(getValues(), defaultValues)) {
      submit();
    }
  }, [defaultValues, getValues, isCancelingRef, submit]);

  return (
    <form onSubmit={submit} noValidate>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item sm={5}>
            <TextField
              label="모델명"
              autoFocus={!model}
              name="name"
              inputRef={(e) => {
                nameInputRef.current = e;
                register(e, {
                  required: "모델명을 입력해주세요.",
                  maxLength: {
                    value: 40,
                    message: "모델명이 너무 길어요.",
                  },
                  validate: (data: string) => {
                    const isDup = existingModelNames.some(
                      (item) => item === data
                    );
                    return isDup ? "중복되는 모델명이 있어요." : true;
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
                  message: "설명이 너무 길어요.",
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
