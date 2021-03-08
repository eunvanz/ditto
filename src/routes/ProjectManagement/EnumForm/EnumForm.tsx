import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { EnumerationDoc, FIELD_TYPE, MemberRole } from "../../../types";
import { useForm } from "react-hook-form";
import EnumFormItem from "./EnumFormItem";
import { checkHasAuthorization } from "../../../helpers/projectHelpers";

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
  enumerations?: EnumerationDoc[];
  onDelete: (enumeration: EnumerationDoc) => void;
  onSubmit: (data: EnumFormValues) => void;
  role: MemberRole;
}

const EnumForm: React.FC<EnumFormProps> = ({
  enumerations,
  onDelete,
  onSubmit,
  role,
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

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

  const showEditForm = useCallback(
    (enumeration: EnumerationDoc, fieldName: keyof EnumFormValues) => {
      if (!hasManagerAuthorization) {
        return;
      }
      setCurrentEnumeration(enumeration);
      setIsNewFormVisible(false);
      setIsEditFormVisible(true);
      setFieldNameToFocus(fieldName);
      setTimeout(clearErrors);
    },
    [clearErrors, hasManagerAuthorization]
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

  return enumerations ? (
    <Card>
      <CardHeader title="Enumeration list" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <caption>
              Enumerations are shared and reusable in this project.
            </caption>
            <TableHead>
              <TableRow>
                <TableCell component="th" className={classes.nameCell}>
                  Enumeration name*
                </TableCell>
                <TableCell component="th" className={classes.fieldTypeCell}>
                  Type*
                </TableCell>
                <TableCell component="th" className={classes.itemsCell}>
                  Values*
                </TableCell>
                <TableCell component="th">Description</TableCell>
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
                      existingEnumerations={enumerations.filter(
                        (item) => item.id !== enumeration.id
                      )}
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
                        {enumeration.items.join(", ")}
                      </TableCell>
                      <TableCell
                        onClick={() => showEditForm(enumeration, "description")}
                      >
                        {enumeration.description}
                      </TableCell>
                      <TableCell align="right">
                        {hasManagerAuthorization && (
                          <IconButton onClick={() => onDelete(enumeration)}>
                            <SvgIcon fontSize="small">
                              <DeleteOutlineIcon />
                            </SvgIcon>
                          </IconButton>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {hasManagerAuthorization && (
                <TableRow>
                  {isNewFormVisible ? (
                    <EnumFormItem
                      formProps={formProps}
                      autoFocusField={fieldNameToFocus}
                      onSubmit={submitAndHideForm}
                      onCancel={hideForm}
                      existingEnumerations={enumerations}
                    />
                  ) : (
                    <TableCell colSpan={5}>
                      <Button
                        className={classes.addButton}
                        fullWidth
                        color="secondary"
                        onClick={showNewForm}
                      >
                        <AddIcon fontSize="small" /> Add new enumeration
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  ) : null;
};

export default EnumForm;
