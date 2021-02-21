import React, { useCallback, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  makeStyles,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Theme } from "../../theme";

export interface RequestParamFormProps {
  title: string;
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

const RequestParamForm: React.FC<RequestParamFormProps> = ({ title }) => {
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
              <Table stickyHeader size="small">
                <caption />
                <TableHead>
                  <TableRow>
                    <TableCell component="th" className={classes.fieldNameCell}>
                      필드명*
                    </TableCell>
                    <TableCell align="center" className={classes.requiredCell}>
                      필수
                    </TableCell>
                    <TableCell align="center" className={classes.arrayCell}>
                      배열
                    </TableCell>
                    <TableCell className={classes.typeCell}>타입*</TableCell>
                    <TableCell className={classes.formatCell}>포맷</TableCell>
                    <TableCell className={classes.formatCell}>열거형</TableCell>
                    <TableCell>설명</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </Box>
          </PerfectScrollbar>
        </>
      )}
    </Card>
  );
};

export default RequestParamForm;
