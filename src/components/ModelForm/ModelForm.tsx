import React, { useCallback, useRef, useEffect, useMemo } from "react";
import {
  Card,
  Box,
  makeStyles,
  IconButton,
  CardHeader,
  Divider,
  Dialog,
} from "@material-ui/core";
import { ModelFieldDoc, ModelDoc, FIELD_TYPE, MemberRole } from "../../types";
import ModelNameForm, { ModelNameFormValues } from "./ModelNameForm";
import CloseIcon from "@material-ui/icons/Close";
import useModalKeyControl from "../../hooks/useModalKeyControl";
import ModelTable from "../ModelTable";
import { SCREEN_MODE } from "../../store/Ui/UiSlice";
import ModelCodeButton from "../ModelCodeButton";

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
  tableContainer: {
    maxHeight: "calc(100vh - 200px)",
    overflow: "auto",
  },
  codeButton: {
    padding: 0,
    color: theme.palette.text.hint,
  },
  cardHeader: {
    "& .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
    },
  },
}));

export interface ModelFieldFormValues {
  fieldName: string;
  fieldType: FIELD_TYPE;
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
  editingModelFieldId?: string;
  isVisible?: boolean;
  role: MemberRole;
  screenMode: SCREEN_MODE;
  onClickExample: (modelField: ModelFieldDoc) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  model,
  onSubmitModel,
  onClose,
  modelFields = [],
  projectModels,
  depth,
  editingModelFieldId,
  isVisible,
  role,
  onClickExample,
}) => {
  const classes = useStyles();

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

  const checkModelNameInput = useCallback(() => {
    if (!modelNameInputRef.current.value) {
      modelNameInputRef.current.focus();
    }
  }, []);

  const cancelTask = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!editingModelFieldId) {
          // ModelNameForm에서의 에서의 참조를 위해
          isCancelingRef.current = true;
        }
      }
    },
    [editingModelFieldId],
  );

  useEffect(() => {
    // keydown일 경우 ModelNameForm 정상동작 하지 않음
    window.addEventListener("keyup", cancelTask);
    return () => {
      window.removeEventListener("keyup", cancelTask);
    };
  }, [cancelTask]);

  useModalKeyControl({
    isVisible,
    onClose,
    name: "ModelForm",
  });

  const checkIsNewFormDisabled = useCallback(() => {
    return modelNameInputRef.current && !modelNameInputRef.current.value;
  }, []);

  if (!depth) {
    return (
      <Card>
        <CardHeader
          className={classes.cardHeader}
          title={
            <>
              Modify model{" "}
              {model && <ModelCodeButton className={classes.codeButton} model={model} />}
            </>
          }
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
          role={role}
        />
        <Divider />
        <Box minWidth={700} className={classes.tableContainer}>
          <ModelTable
            model={model}
            modelFields={modelFields}
            checkIsNewFormDisabled={checkIsNewFormDisabled}
            onShowNewForm={checkModelNameInput}
            role={role}
            isExampleAvailable
            onClickExample={onClickExample}
          />
        </Box>
      </Card>
    );
  } else {
    return (
      <ModelTable
        model={model}
        modelFields={modelFields}
        depth={depth}
        role={role}
        isExampleAvailable
        onClickExample={onClickExample}
      />
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
  screenMode,
  ...restProps
}) => {
  return (
    <Dialog
      open={isVisible}
      fullWidth
      maxWidth={screenMode === SCREEN_MODE.WIDE ? "xl" : "lg"}
      scroll="body"
    >
      <ModelForm
        {...restProps}
        screenMode={screenMode}
        onClose={onClose}
        isVisible={isVisible}
      />
    </Dialog>
  );
};

export default ModelForm;
