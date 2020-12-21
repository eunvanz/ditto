import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  Card,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  makeStyles,
  TableBody,
  Button,
  IconButton,
  CardHeader,
  Divider,
  Dialog,
} from "@material-ui/core";
import PerfectScrollbar from "react-perfect-scrollbar";
import AddIcon from "@material-ui/icons/Add";
import ModelFieldFormItem from "./ModelFieldFormItem";
import { ModelFieldDoc, ModelDoc } from "../../types";
import ModelNameForm, { ModelNameFormValues } from "./ModelNameForm";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
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
  },
  submit: {
    display: "none",
  },
}));

export interface ModelFieldFormValues {
  fieldName: string;
  fieldType: string;
  format: string;
  isRequired: boolean;
  isArray: boolean;
  description: string;
  enum: string;
  target?: ModelFieldDoc;
}

export interface ModelFormProps {
  onSubmitModelField: (data: ModelFieldFormValues) => void;
  model?: ModelDoc;
  modelFields?: ModelFieldDoc[];
  onDeleteModelField: (modelField: ModelFieldDoc) => void;
  onSubmitModel: (data: ModelNameFormValues) => void;
  /**
   * onClose가 전달되면 X 버튼이 생성
   */
  onClose?: () => void;
  existingModelNames: string[];
}

const ModelForm: React.FC<ModelFormProps> = ({
  onSubmitModelField,
  model,
  onDeleteModelField,
  onSubmitModel,
  onClose,
  modelFields = [],
  existingModelNames,
}) => {
  const classes = useStyles();

  const [isNewFormVisible, setIsNewFormVisible] = useState(false);

  const modelNameInputRef = useRef<any>(undefined);
  const isCancelingRef = useRef<boolean>(false);

  const showNewForm = useCallback(() => {
    if (!!modelNameInputRef.current.value) {
      setIsNewFormVisible(true);
    }
  }, []);

  const cancelTask = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // ModelNameForm과 ModelFieldFormItem에서의 에서의 참조를 위해
        isCancelingRef.current = true;
        if (!isNewFormVisible) {
          onClose?.();
        } else {
          setIsNewFormVisible(false);
        }
      }
    },
    [isNewFormVisible, onClose]
  );

  useEffect(() => {
    window.addEventListener("keyup", cancelTask);
    return () => {
      window.removeEventListener("keyup", cancelTask);
    };
  }, [cancelTask]);

  return (
    <Card>
      <CardHeader
        title="모델 편집"
        action={
          onClose ? (
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : undefined
        }
      />
      <Divider />
      <ModelNameForm
        isCancelingRef={isCancelingRef}
        nameInputRef={modelNameInputRef}
        onSubmit={onSubmitModel}
        model={model}
        existingModelNames={existingModelNames}
      />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={700}>
          <Table>
            <caption></caption>
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
            <TableBody>
              {modelFields.map((modelField) => (
                <ModelFieldFormItem
                  key={modelField.id}
                  modelFields={modelFields}
                  modelField={modelField}
                  onSubmit={onSubmitModelField}
                  onDelete={() => onDeleteModelField(modelField)}
                />
              ))}
              {isNewFormVisible ? (
                <ModelFieldFormItem
                  modelFields={modelFields}
                  onSubmit={(data) => {
                    onSubmitModelField(data);
                    setIsNewFormVisible(false);
                  }}
                  isNew
                />
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Button
                      className={classes.addButton}
                      fullWidth
                      color="secondary"
                      onClick={showNewForm}
                    >
                      <AddIcon fontSize="small" /> 새로운 필드 추가
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

export interface ModelFormModalProps extends ModelFormProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ModelFormModal: React.FC<ModelFormModalProps> = ({
  isVisible,
  onClose,
  ...restProps
}) => {
  return (
    <Dialog open={isVisible} fullWidth maxWidth="xl">
      <ModelForm {...restProps} onClose={onClose} />
    </Dialog>
  );
};

export default ModelForm;
