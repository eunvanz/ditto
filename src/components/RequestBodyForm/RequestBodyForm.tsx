import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  makeStyles,
  TextField,
  Collapse,
  SvgIcon,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Theme } from "../../theme";
import { MemberRole, ModelFieldDoc, RequestBodyDoc } from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import ModelTable from "../ModelTable";
import {
  getTextFieldErrorProps,
  mediaTypes,
} from "../../helpers/projectHelpers";

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    cursor: "pointer",
    "& .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
    },
  },
  countChip: {
    height: 18,
    marginLeft: 10,
    "&> span": {
      color: theme.palette.text.secondary,
      fontSize: "0.875rem",
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  addButton: {
    justifyContent: "start",
    textTransform: "unset",
  },
  mediaTypeCell: {
    width: 200,
  },
  typeCell: {
    width: 100,
  },
  formatCell: {
    width: 150,
  },
  buttonCell: {
    width: 60,
  },
  autocomplete: {
    "& .MuiAutocomplete-inputRoot": {
      paddingBottom: 0,
    },
  },
  expandIcon: {
    paddingRight: 4,
    paddingLeft: 0,
  },
}));

export interface RequestBodyFormProps {
  requestBodies?: RequestBodyDoc[];
  onSubmit: (values: ModelFieldFormValues) => void;
  onDelete: (requestBody: ModelFieldDoc) => void;
  checkIsSubmittingRequestBody: (id?: string) => boolean;
  role: MemberRole;
}

const RequestBodyForm: React.FC<RequestBodyFormProps> = ({
  requestBodies,
  onSubmit,
  onDelete,
  checkIsSubmittingRequestBody,
  role,
}: RequestBodyFormProps) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState<boolean>(
    requestBodies?.length ? true : false
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  useEffect(() => {
    // 최초 로딩 시 requestParam이 undefined이므로 lazy loading 처리를 위해 적용
    if (requestBodies?.length) {
      setIsOpen(true);
    }
    // eslint-disable-next-line
  }, [requestBodies?.length]);

  return (
    <Card>
      <CardHeader
        className={classes.header}
        title={
          <>
            <SvgIcon fontSize="small" className={classes.expandIcon}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </SvgIcon>
            Body
            {requestBodies?.length ? (
              <Chip
                className={classes.countChip}
                label={requestBodies.length}
              />
            ) : (
              ""
            )}
          </>
        }
        onClick={toggleOpen}
      />
      <Collapse in={isOpen}>
        <Divider />
        <PerfectScrollbar>
          <Box minWidth={700}>
            <ModelTable
              modelFields={requestBodies}
              onSubmitModelFieldCustom={onSubmit}
              onDeleteModelFieldCustom={onDelete}
              checkIsSubmittingModelFieldCustom={checkIsSubmittingRequestBody}
              customFieldName="Media-type"
              customFieldNameInput={({
                renderProps,
                setValue,
                autoFocusField,
                inputRef,
                errors,
                setIsDisabledEnterSubmit,
              }) => (
                <Autocomplete
                  value={renderProps.value}
                  openOnFocus
                  className={classes.autocomplete}
                  options={mediaTypes}
                  onChange={(_e, value) => {
                    setValue("fieldName", value, { shouldValidate: true });
                  }}
                  freeSolo
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        inputRef={inputRef}
                        required
                        placeholder="Media-type"
                        autoFocus={autoFocusField === "fieldName"}
                        {...getTextFieldErrorProps(errors.fieldName)}
                      />
                    );
                  }}
                  onFocus={() => setIsDisabledEnterSubmit(true)}
                  onBlur={() => setIsDisabledEnterSubmit(false)}
                  size="small"
                />
              )}
              role={role}
            />
          </Box>
        </PerfectScrollbar>
      </Collapse>
    </Card>
  );
};

export default RequestBodyForm;
