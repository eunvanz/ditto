import React from "react";
import { ModelDoc } from "../../../types";
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
import PerfectScrollbar from "react-perfect-scrollbar";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import AddIcon from "@material-ui/icons/Add";

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
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  onDelete,
  onClickName,
  onClickAdd,
}) => {
  const classes = useStyles();

  return models ? (
    <Card>
      <CardHeader title="모델 목록" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <caption>
              등록된 모델은 프로젝트 내 어디에서든지 재사용 될 수 있습니다.
            </caption>
            <TableHead>
              <TableRow>
                <TableCell component="th" className={classes.nameCell}>
                  모델명*
                </TableCell>
                <TableCell component="th">설명</TableCell>
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
                    <IconButton onClick={() => onDelete(model)}>
                      <SvgIcon fontSize="small">
                        <DeleteOutlineIcon />
                      </SvgIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3}>
                  <Button
                    className={classes.addButton}
                    fullWidth
                    color="secondary"
                    onClick={onClickAdd}
                  >
                    <AddIcon fontSize="small" /> 새로운 모델 등록
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  ) : null;
};

export default ModelList;
