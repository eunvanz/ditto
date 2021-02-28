import React, { useCallback, useState } from "react";
import { Box, Card, CardHeader, Divider, makeStyles } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Theme } from "../../theme";
import { ModelFieldDoc, RequestParamDoc } from "../../types";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import ModelTable from "../ModelTable";

export interface RequestParamFormProps {
  title: string;
  requestParams: RequestParamDoc[];
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
}));

const RequestParamForm: React.FC<RequestParamFormProps> = ({
  title,
  requestParams,
  onSubmitRequestParamForm,
  onDeleteRequestParam,
  checkIsSubmittingRequestParam,
}) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  return (
    <Card>
      <CardHeader
        className={classes.header}
        title={title}
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
              />
            </Box>
          </PerfectScrollbar>
        </>
      )}
    </Card>
  );
};

export default RequestParamForm;
