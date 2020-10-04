import React from "react";
import {
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  TextField,
  makeStyles,
  Theme,
  Box,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { ModelItem } from "../../types";
import ModelFieldForm from "../ModelFieldForm";

const useStyles = makeStyles((theme: Theme) => ({
  submitButton: {
    marginLeft: 8,
  },
  deleteButton: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
}));

export interface ModelFormValues {
  name: string;
  description: string;
}

export interface ModelFormProps {
  model?: ModelItem;
}

const ModelForm: React.FC<ModelFormProps> = ({ model }) => {
  const classes = useStyles();

  const { register, errors } = useForm<ModelFormValues>({
    mode: "onChange",
    defaultValues: {
      name: model?.name,
      description: model?.description,
    },
  });

  return (
    <>
      <Box>
        <Card>
          <CardHeader title="모델 기본정보" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item sm={5}>
                <TextField
                  label="모델명"
                  name="name"
                  inputRef={register({
                    required: "모델명을 입력해주세요.",
                    maxLength: {
                      value: 60,
                      message: "별로 좋은 생각이 아닌 것 같아요.",
                    },
                  })}
                  variant="outlined"
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  size="small"
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
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ModelForm;
