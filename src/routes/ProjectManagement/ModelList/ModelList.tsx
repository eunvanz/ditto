import React, { useMemo } from "react";
import {
  Card,
  CardHeader,
  Divider,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TableBody,
  Button,
  IconButton,
  SvgIcon,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import PerfectScrollbar from "react-perfect-scrollbar";
import { checkHasAuthorization } from "../../../helpers/projectHelpers";
import { MemberRole, ModelDoc } from "../../../types";

const useStyles = makeStyles(() => ({
  nameCell: {
    width: 300,
  },
  addButton: {
    justifyContent: "start",
  },
  nameButton: {
    justifyContent: "start",
    textTransform: "none",
  },
}));

export interface ModelListProps {
  models?: ModelDoc[];
  onDelete: (model: ModelDoc) => void;
  onClickName: (model: ModelDoc) => void;
  onClickAdd: () => void;
  role: MemberRole;
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  onDelete,
  onClickName,
  onClickAdd,
  role,
}) => {
  const classes = useStyles();

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

  return models ? (
    <Card>
      <CardHeader title="Model list" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <caption>Models are shared and reusable in this project.</caption>
            <TableHead>
              <TableRow>
                <TableCell component="th" className={classes.nameCell}>
                  Model name*
                </TableCell>
                <TableCell component="th">Description</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>
                    <Button
                      className={classes.nameButton}
                      fullWidth
                      onClick={() => onClickName(model)}
                    >
                      {model.name}
                    </Button>
                  </TableCell>
                  <TableCell>{model.description}</TableCell>
                  <TableCell align="right">
                    {hasManagerAuthorization && (
                      <IconButton onClick={() => onDelete(model)}>
                        <SvgIcon fontSize="small">
                          <DeleteOutlineIcon />
                        </SvgIcon>
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {hasManagerAuthorization && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Button
                      className={classes.addButton}
                      fullWidth
                      color="secondary"
                      onClick={onClickAdd}
                    >
                      <AddIcon fontSize="small" /> Add new model
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  ) : null;
};

export default ModelList;
