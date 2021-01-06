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
import { ExpandLess, ExpandMore } from "@material-ui/icons";

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
    textTransform: "unset",
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
}) => {
  const classes = useStyles();

  const [isNewFormVisible, setIsNewFormVisible] = useState(false);

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
          isCancelingRef={isCancelingRef}
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
          projectModels={projectModels}
          depth={depth}
          onCancel={() => setIsNewFormVisible(false)}
          isCancelingRef={isCancelingRef}
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
  "depth" | "model" | "onClose" | "onSubmitModel"
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
