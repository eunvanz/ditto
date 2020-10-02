import React, { useCallback, useEffect } from "react";
import {
  Card,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TableBody,
  Button,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/Add";
import ModelFormItem from "./ModelFormItem";
import { useForm } from "react-hook-form";

const useStyles = makeStyles(() => ({
  fieldNameCell: {
    width: 150,
  },
  typeCell: {
    width: 100,
  },
  formatCell: {
    width: 120,
  },
  requiredCell: {
    width: 40,
  },
  addButton: {
    justifyContent: "start",
  },
  submit: {
    display: "none",
  },
}));

export interface ModelFormValues {
  fieldName: string;
  fieldType: string;
  format: string;
  isRequired: boolean;
  description: string;
}

export interface ModelFormProps {
  onSubmit: (data: ModelFormValues) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({ onSubmit }) => {
  const classes = useStyles();

  const formProps = useForm<ModelFormValues>({
    mode: "onChange",
  });

  const {
    handleSubmit,
    errors,
    watch,
    getValues,
    setValue,
    register,
  } = formProps;

  const handleOnBlur = useCallback(() => {}, []);

  const handleOnFocus = useCallback(() => {}, []);

  const handleOnSubmit = useCallback(
    (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      handleSubmit((data) => {
        onSubmit(data);
      })();
    },
    [handleSubmit, onSubmit]
  );

  useEffect(() => {
    register("fieldType", { required: "타입을 선택해주세요." });
    register("format");
  }, [register]);

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Card>
        <PerfectScrollbar>
          <Box minWidth={700}>
            <Table>
              <caption></caption>
              <TableHead>
                <TableRow>
                  <TableCell component="th" className={classes.fieldNameCell}>
                    필드명*
                  </TableCell>
                  <TableCell className={classes.requiredCell}>필수</TableCell>
                  <TableCell className={classes.typeCell}>타입*</TableCell>
                  <TableCell className={classes.formatCell}>포맷</TableCell>
                  <TableCell className={classes.formatCell}>열거형</TableCell>
                  <TableCell>설명</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Button
                      className={classes.addButton}
                      fullWidth
                      color="secondary"
                    >
                      <AddIcon fontSize="small" /> 새로운 필드 추가
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <ModelFormItem
                    formProps={formProps}
                    onBlur={handleOnBlur}
                    onFocus={handleOnFocus}
                  />
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
      <button className={classes.submit} type="submit" />
    </form>
  );
};

export default ModelForm;
