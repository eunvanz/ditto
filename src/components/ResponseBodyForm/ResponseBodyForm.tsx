import {
  Box,
  Card,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  makeStyles,
  styled,
  SvgIcon,
} from "@material-ui/core";
import { Edit, ExpandLess, ExpandMore } from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import React, { FC, useCallback, useMemo, useState } from "react";
import { Theme } from "../../theme";
import { ModelFieldDoc, ResponseBodyDoc, ResponseStatusDoc } from "../../types";
import ModelTable from "../ModelTable";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import Clear from "@material-ui/icons/Clear";
import Label from "../Label";

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    cursor: "pointer",
    "& .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
    },
    "& .MuiIconButton-sizeSmall": {
      marginLeft: 4,
    },
  },
  description: {
    color: theme.palette.text.hint,
  },
  expandIcon: {
    padding: 4,
    paddingLeft: 0,
  },
  fieldNameCell: {
    width: 100,
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

export interface ResponseBodyFormProps {
  responseStatus: ResponseStatusDoc;
  responseBodies?: ResponseBodyDoc[];
  onDeleteResponseStatus: () => void;
  onSubmitResponseBody: (values: ModelFieldFormValues) => void;
  onDeleteResponseBody: (responseBody: ModelFieldDoc) => void;
  checkIsSubmittingResponseBody: (id?: string) => boolean;
  onEditResponseStatus: () => void;
}

const ResponseBodyForm: React.FC<ResponseBodyFormProps> = ({
  responseStatus,
  responseBodies,
  onDeleteResponseStatus,
  onSubmitResponseBody,
  onDeleteResponseBody,
  checkIsSubmittingResponseBody,
  onEditResponseStatus,
}) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState<boolean>(
    responseBodies?.length ? true : false
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);
  return (
    <Card>
      <CardHeader
        className={classes.header}
        title={
          <>
            <SvgIcon fontSize="small" className={classes.expandIcon}>
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </SvgIcon>
            Status code <StatusBadge statusCode={responseStatus.statusCode} />
            {responseBodies?.length ? (
              <Chip
                className={classes.countChip}
                label={responseBodies.length}
              />
            ) : (
              ""
            )}
          </>
        }
        action={
          <>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEditResponseStatus();
              }}
            >
              <SvgIcon fontSize="small">
                <Edit />
              </SvgIcon>
            </IconButton>
            {responseStatus.statusCode !== 200 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteResponseStatus();
                }}
              >
                <SvgIcon fontSize="small">
                  <Clear />
                </SvgIcon>
              </IconButton>
            )}
          </>
        }
        onClick={toggleOpen}
      />
      {isOpen && (
        <>
          {responseStatus.description && (
            <Box p={2} pt={0} className={classes.description}>
              {responseStatus.description}
            </Box>
          )}
          <Divider />
          <PerfectScrollbar>
            <Box minWidth={700}>
              <ModelTable
                modelFields={responseBodies}
                onSubmitModelFieldCustom={onSubmitResponseBody}
                onDeleteModelFieldCustom={onDeleteResponseBody}
                checkIsSubmittingModelFieldCustom={
                  checkIsSubmittingResponseBody
                }
                customFieldName="Media-type"
                disabledColumns={["isRequired"]}
              />
            </Box>
          </PerfectScrollbar>
        </>
      )}
    </Card>
  );
};

interface StatusBadgeProps {
  statusCode: number;
}

const StatusLabel = styled(Label)({
  fontSize: "1rem",
});

const StatusBadge: FC<StatusBadgeProps> = ({ statusCode }) => {
  const color = useMemo(() => {
    if (statusCode >= 200 && statusCode < 300) {
      return "success";
    } else if (statusCode < 400) {
      return "warning";
    } else if (statusCode < 500) {
      return "error";
    } else if (statusCode < 600) {
      return "error";
    } else {
      return "primary";
    }
  }, [statusCode]);

  return <StatusLabel color={color}>{statusCode}</StatusLabel>;
};

export default ResponseBodyForm;
