import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Theme } from "../../theme";
import {
  ModelFieldDoc,
  RequestParamDoc,
  REQUEST_PARAM_LOCATION,
} from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import ModelTable from "../ModelTable";
import { ModelFieldColumns } from "../ModelForm/ModelFieldFormItem";

export interface RequestParamFormProps {
  location: REQUEST_PARAM_LOCATION;
  requestParams?: RequestParamDoc[];
  onSubmitRequestParamForm: (values: ModelFieldFormValues) => void;
  onDeleteRequestParam: (requestParam: ModelFieldDoc) => void;
  checkIsSubmittingRequestParam: (id?: string) => boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    cursor: "pointer",
    "& .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
    },
  },
  fieldNameCell: {
    width: 150,
  },
  typeCell: {
    width: 100,
  },
  arrayCell: {
    width: 50,
  },
  formatCell: {
    width: 120,
  },
  requiredCell: {
    width: 50,
  },
  addButton: {
    justifyContent: "start",
    textTransform: "unset",
  },
  submit: {
    display: "none",
  },
  addSubButton: {
    marginLeft: 10,
    color: theme.palette.text.secondary,
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
}));

const RequestParamForm: React.FC<RequestParamFormProps> = ({
  location,
  requestParams,
  onSubmitRequestParamForm,
  onDeleteRequestParam,
  checkIsSubmittingRequestParam,
}) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState<boolean>(
    requestParams?.length ? true : false
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  const title = useMemo(() => {
    switch (location) {
      case REQUEST_PARAM_LOCATION.COOKIE:
        return "Cookies";
      case REQUEST_PARAM_LOCATION.HEADER:
        return "Headers";
      case REQUEST_PARAM_LOCATION.PATH:
        return "Path Params";
      case REQUEST_PARAM_LOCATION.QUERY:
        return "Query Params";
    }
  }, [location]);

  const hiddenColumns: ModelFieldColumns[] = useMemo(() => {
    switch (location) {
      case REQUEST_PARAM_LOCATION.COOKIE:
        return [];
      case REQUEST_PARAM_LOCATION.HEADER:
        return [];
      case REQUEST_PARAM_LOCATION.PATH:
        return ["isRequired", "isArray"];
      case REQUEST_PARAM_LOCATION.QUERY:
        return [];
    }
  }, [location]);

  useEffect(() => {
    // 최초 로딩 시 requestParam이 undefined이므로 lazy loading 처리를 위해 적용
    if (requestParams?.length) {
      setIsOpen(true);
    }
    // eslint-disable-next-line
  }, [requestParams?.length]);

  return (
    <Card>
      <CardHeader
        className={classes.header}
        title={
          <>
            {title}
            {requestParams?.length ? (
              <Chip
                className={classes.countChip}
                label={requestParams.length}
              />
            ) : (
              ""
            )}
          </>
        }
        action={isOpen ? <ExpandLess /> : <ExpandMore />}
        onClick={toggleOpen}
      />
      {isOpen && (
        <>
          <Divider />
          <PerfectScrollbar>
            <Box minWidth={700}>
              <ModelTable
                modelFields={requestParams}
                onSubmitModelFieldCustom={onSubmitRequestParamForm}
                onDeleteModelFieldCustom={onDeleteRequestParam}
                checkIsSubmittingModelFieldCustom={
                  checkIsSubmittingRequestParam
                }
                customFieldName="Key"
                hiddenColumns={hiddenColumns}
              />
            </Box>
          </PerfectScrollbar>
        </>
      )}
    </Card>
  );
};

export default RequestParamForm;
