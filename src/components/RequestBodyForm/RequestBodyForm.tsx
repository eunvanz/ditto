import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import React, { useCallback, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Theme } from "../../theme";
import { RequestBodyDoc } from "../../types";
import RequestBodyFormItem from "./RequestBodyFormItem";

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
}));

export interface RequestBodyFormProps {
  requestBodies: RequestBodyDoc[];
}

const RequestBodyForm: React.FC<RequestBodyFormProps> = ({
  requestBodies,
}: RequestBodyFormProps) => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState<boolean>(
    requestBodies?.length ? true : false
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);

  const [isNewFormVisible, setIsNewFormVisible] = useState(false);

  const showNewForm = useCallback(() => {
    setIsNewFormVisible(true);
  }, []);

  const hideNewForm = useCallback(() => {
    setIsNewFormVisible(false);
  }, []);

  useEffect(() => {
    // 최초 로딩 시 requestParam이 undefined이므로 lazy loading 처리를 위해 적용
    if (requestBodies?.length) {
      setIsOpen(true);
    }
  }, [requestBodies]);

  return (
    <Card>
      <CardHeader
        className={classes.header}
        title={
          <>
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
        action={isOpen ? <ExpandLess /> : <ExpandMore />}
        onClick={toggleOpen}
      />
      {isOpen && (
        <>
          <Divider />
          <PerfectScrollbar>
            <Box minWidth={700}>
              <Table stickyHeader size="small">
                <caption />
                <TableHead>
                  <TableRow>
                    <TableCell component="th" className={classes.mediaTypeCell}>
                      Media-type*
                    </TableCell>
                    <TableCell component="th" className={classes.typeCell}>
                      Type*
                    </TableCell>
                    <TableCell component="th" className={classes.formatCell}>
                      Format
                    </TableCell>
                    <TableCell component="th" className={classes.formatCell}>
                      Enumeration
                    </TableCell>
                    <TableCell component="th">Description</TableCell>
                    <TableCell
                      align="right"
                      className={classes.buttonCell}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestBodies.map((requestBody) => (
                    <RequestBodyFormItem requestBody={requestBody} />
                  ))}
                  {isNewFormVisible ? (
                    <RequestBodyFormItem isNewForm onHideForm={hideNewForm} />
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Button
                          className={classes.addButton}
                          fullWidth
                          color="secondary"
                          onClick={showNewForm}
                        >
                          <Add fontSize="small" /> ADD NEW REQUEST BODY
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </PerfectScrollbar>
        </>
      )}
    </Card>
  );
};

export default RequestBodyForm;
