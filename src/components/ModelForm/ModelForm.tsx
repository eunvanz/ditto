import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";
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
import { getIntentionPaddingByDepth } from "../../helpers/projectHelpers";
import { ExpandLess, ExpandMore, EditOutlined } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
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

export interface ModelFieldFormValues {
  fieldName: string;
  fieldType: string;
  format: string;
  isRequired: boolean;
  isArray: boolean;
  description: string;
  enum: string;
  target?: ModelFieldDoc;
  depth?: number;
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
  /**
   * 같은 프로젝트 내의 모델들
   */
  projectModels: ModelDoc[];
  depth?: number;
  checkIsSubmittingModelField: (modelId?: string) => boolean;
  onSetEditingModelField: (modelFieldId?: string) => void;
  editingModelFieldId?: string;
  onClickQuickEditModelName: (model: ModelDoc) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  onSubmitModelField,
  model,
  onDeleteModelField,
  onSubmitModel,
  onClose,
  modelFields = [],
  projectModels,
  depth,
  checkIsSubmittingModelField,
  onSetEditingModelField,
  editingModelFieldId,
  onClickQuickEditModelName,
}) => {
  const classes = useStyles();

  const isNewFormVisible = useMemo(() => {
    return editingModelFieldId === "NEW";
  }, [editingModelFieldId]);

  const resetEditingModelField = useCallback(() => {
    onSetEditingModelField(undefined);
  }, [onSetEditingModelField]);

  const modelNameInputRef = useRef<any | undefined>(undefined);
  const isCancelingRef = useRef<boolean>(false);

  /**
   * 자기 자신이 아닌 프로젝트내의 사용중인 모델 명들
   */
  const existingModelNames = useMemo(() => {
    const result: string[] = [];
    projectModels.forEach((item) => {
      if (!model || item.id !== model.id) {
        result.push(item.name);
      }
    });
    return result;
  }, [model, projectModels]);

  const showNewForm = useCallback(() => {
    if (
      modelNameInputRef.current === undefined || // modelNameInput이 없는 경우 (depth 존재)
      !!modelNameInputRef.current.value
    ) {
      onSetEditingModelField("NEW");
    }
  }, [onSetEditingModelField]);

  const cancelTask = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // ModelNameForm에서의 에서의 참조를 위해
        isCancelingRef.current = true;
        if (!isNewFormVisible) {
          onClose?.();
        } else {
          onSetEditingModelField(undefined);
        }
      }
    },
    [isNewFormVisible, onClose, onSetEditingModelField]
  );

  useEffect(() => {
    window.addEventListener("keyup", cancelTask);
    return () => {
      window.removeEventListener("keyup", cancelTask);
    };
  }, [cancelTask]);

  const indentionPadding = useMemo(() => {
    return getIntentionPaddingByDepth(depth);
  }, [depth]);

  const addText = useMemo(() => {
    return depth ? `${model?.name}에 새로운 필드 추가` : "새로운 필드 추가";
  }, [depth, model]);

  return (
    <Wrapper
      existingModelNames={existingModelNames}
      onSubmitModel={onSubmitModel}
      depth={depth}
      model={model}
      onClose={onClose}
      isCancelingRef={isCancelingRef}
      modelNameInputRef={modelNameInputRef}
      onClickQuickEditModelName={onClickQuickEditModelName}
    >
      {modelFields.map((modelField) => (
        <ModelFieldFormItem
          key={modelField.id}
          modelFields={modelFields}
          modelField={modelField}
          onSubmit={onSubmitModelField}
          onDelete={() => onDeleteModelField(modelField)}
          projectModels={projectModels}
          depth={depth}
          isSubmitting={checkIsSubmittingModelField(modelField.id)}
          onClickCell={() => onSetEditingModelField(modelField.id)}
          isFormVisible={editingModelFieldId === modelField.id}
          onCancel={resetEditingModelField}
        />
      ))}
      {isNewFormVisible ? (
        <ModelFieldFormItem
          modelFields={modelFields}
          onSubmit={onSubmitModelField}
          isFormVisible
          projectModels={projectModels}
          depth={depth}
          onCancel={resetEditingModelField}
          isSubmitting={checkIsSubmittingModelField()}
        />
      ) : (
        <TableRow>
          <TableCell colSpan={8} style={{ paddingLeft: indentionPadding }}>
            <Button
              className={classes.addButton}
              fullWidth
              color="secondary"
              onClick={showNewForm}
            >
              <AddIcon fontSize="small" /> {addText}
            </Button>
          </TableCell>
        </TableRow>
      )}
    </Wrapper>
  );
};

type WrapperProps = Pick<
  ModelFormProps,
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
  onClose,
  onSubmitModel,
  existingModelNames,
  children,
  isCancelingRef,
  modelNameInputRef,
  onClickQuickEditModelName,
}) => {
  const classes = useStyles();

  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const indentionPadding = useMemo(() => {
    return getIntentionPaddingByDepth(depth);
  }, [depth]);

  if (!depth) {
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
            <Table stickyHeader>
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
              <TableBody>{children}</TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
      </Card>
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
    <Dialog open={isVisible} fullWidth maxWidth="xl" scroll="body">
      <ModelForm {...restProps} onClose={onClose} />
    </Dialog>
  );
};

export default ModelForm;
