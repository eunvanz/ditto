import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  makeStyles,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddIcon from "@material-ui/icons/Add";
import { EnumerationDoc, FIELD_TYPE } from "../../../types";
import { useForm } from "react-hook-form";
import EnumFormItem from "./EnumFormItem";

const useStyles = makeStyles(() => ({
  nameCell: {
    width: 150,
  },
  fieldTypeCell: {
    width: 80,
  },
  itemsCell: {
    width: 400,
  },
  addButton: {
    justifyContent: "start",
  },
}));

export interface EnumFormValues {
  name: string;
  fieldType: FIELD_TYPE;
  items: string;
  description?: string;
  target?: EnumerationDoc;
}

export interface EnumFormProps {
  enumerations: EnumerationDoc[];
  onDelete: (enumeration: EnumerationDoc) => void;
  onSubmit: (data: EnumFormValues) => void;
}

const EnumForm: React.FC<EnumFormProps> = ({
  enumerations,
  onDelete,
  onSubmit,
}) => {
  const classes = useStyles();

  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isNewFormVisible, setIsNewFormVisible] = useState(false);
  const [currentEnumeration, setCurrentEnumeration] = useState<
    EnumerationDoc | undefined
  >(undefined);
  const [fieldNameToFocus, setFieldNameToFocus] = useState<
    keyof EnumFormValues | undefined
  >(undefined);

  const formProps = useForm<EnumFormValues>({
    mode: "onChange",
  });

  const { setValue, reset, clearErrors } = formProps;

  const showEditForm = useCallback(
    (enumeration: EnumerationDoc, fieldName: keyof EnumFormValues) => {
      setCurrentEnumeration(enumeration);
      setIsNewFormVisible(false);
      setIsEditFormVisible(true);
      setFieldNameToFocus(fieldName);
      setTimeout(clearErrors);
    },
    [clearErrors]
  );

  const hideForm = useCallback(() => {
    setIsEditFormVisible(false);
    setIsNewFormVisible(false);
    setCurrentEnumeration(undefined);
    setFieldNameToFocus(undefined);
    reset();
  }, [reset]);

  const showNewForm = useCallback(() => {
    reset();
    setIsEditFormVisible(false);
    setCurrentEnumeration(undefined);
    setIsNewFormVisible(true);
    setFieldNameToFocus("name");
  }, [reset]);

  useEffect(() => {
    if (currentEnumeration) {
      setValue("name", currentEnumeration.name, { shouldValidate: true });
      setValue("fieldType", currentEnumeration.fieldType, {
        shouldValidate: true,
      });
      setValue("items", currentEnumeration.items.join(","), {
        shouldValidate: true,
      });
      setValue("description", currentEnumeration.description, {
        shouldValidate: true,
      });
    }
  }, [currentEnumeration, setValue]);

  const submitAndHideForm = useCallback(
    (data: EnumFormValues) => {
      onSubmit({ ...data, target: currentEnumeration });
      hideForm();
    },
    [currentEnumeration, hideForm, onSubmit]
  );

  return (
    <Card>
      <CardHeader title="열거형 목록" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <caption>
              등록된 열거형은 프로젝트 내 어디에서든지 재사용 될 수 있습니다.
            </caption>
            <TableHead>
              <TableRow>
                <TableCell component="th" className={classes.nameCell}>
                  열거형 명*
                </TableCell>
                <TableCell component="th" className={classes.fieldTypeCell}>
                  타입*
                </TableCell>
                <TableCell component="th" className={classes.itemsCell}>
                  값*
                </TableCell>
                <TableCell component="th">설명</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enumerations.map((enumeration) => (
                <TableRow key={enumeration.id}>
                  {isEditFormVisible &&
                  currentEnumeration?.id === enumeration.id ? (
                    <EnumFormItem
                      formProps={formProps}
                      autoFocusField={fieldNameToFocus}
                      defaultFieldType={enumeration.fieldType}
                      onSubmit={submitAndHideForm}
                      onCancel={hideForm}
                    />
                  ) : (
                    <>
                      <TableCell
                        onClick={() => showEditForm(enumeration, "name")}
                      >
                        {enumeration.name}
                      </TableCell>
                      <TableCell
                        onClick={() => showEditForm(enumeration, "fieldType")}
                      >
                        {enumeration.fieldType}
                      </TableCell>
                      <TableCell
                        onClick={() => showEditForm(enumeration, "items")}
                      >
                        {enumeration.items.join(",")}
                      </TableCell>
                      <TableCell
                        onClick={() => showEditForm(enumeration, "description")}
                      >
                        {enumeration.description}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => onDelete(enumeration)}>
                          <SvgIcon fontSize="small">
                            <DeleteOutlineIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              <TableRow>
                {isNewFormVisible ? (
                  <EnumFormItem
                    formProps={formProps}
                    autoFocusField={fieldNameToFocus}
                    onSubmit={submitAndHideForm}
                    onCancel={hideForm}
                  />
                ) : (
                  <TableCell colSpan={5}>
                    <Button
                      className={classes.addButton}
                      fullWidth
                      color="secondary"
                      onClick={showNewForm}
                    >
                      <AddIcon fontSize="small" /> 새로운 열거형 등록
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export default EnumForm;
