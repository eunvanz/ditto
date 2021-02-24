import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { Theme } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
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

export interface ModelTableProps {}

const ModelTable: React.FC<ModelTableProps> = ({ model }) => {
  const classes = useStyles();

  return (
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
      <TableBody>{children}</TableBody>
    </Table>
  );
};

type WrapperProps = Pick<
  ModelTableProps,
  "depth" | "model" | "onClose" | "onSubmitModel" | "onClickQuickEditModelName"
> & {
  existingModelNames: string[];
  children: React.ReactNode;
  isCancelingRef: React.MutableRefObject<boolean>;
  modelNameInputRef: React.MutableRefObject<any>;
};

const Wrapper: React.FC<WrapperProps> = ({
  depth,
  model,
  children,
  onClickQuickEditModelName,
}) => {
  const classes = useStyles();

  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const indentionPadding = useMemo(() => {
    return getIntentionPaddingByDepth(depth);
  }, [depth]);

  if (!depth) {
    return (
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
        <TableBody>{children}</TableBody>
      </Table>
    );
  } else {
    return (
      <>
        <TableRow>
          <TableCell colSpan={8} style={{ paddingLeft: indentionPadding }}>
            <Button
              className={classes.addButton}
              fullWidth
              color="secondary"
              onClick={() => setIsDetailVisible(!isDetailVisible)}
            >
              {!isDetailVisible && (
                <>
                  <ExpandMore fontSize="small" /> {model?.name} 펼치기
                </>
              )}
              {isDetailVisible && (
                <>
                  <ExpandLess fontSize="small" /> {model?.name} 접기
                  <Button
                    className={classes.addSubButton}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickQuickEditModelName(model!);
                    }}
                  >
                    <EditOutlined fontSize="small" />
                  </Button>
                </>
              )}
            </Button>
          </TableCell>
        </TableRow>
        {isDetailVisible ? children : null}
      </>
    );
  }
};

export default ModelTable;
