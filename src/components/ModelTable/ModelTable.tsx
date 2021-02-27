import {
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { EditOutlined, ExpandLess, ExpandMore, Add } from "@material-ui/icons";
import React, { useCallback, useMemo, useState } from "react";
import { getIntentionPaddingByDepth } from "../../helpers/projectHelpers";
import { Theme } from "../../theme";
import { EnumerationDoc, ModelDoc, ModelFieldDoc } from "../../types";
import ModelFieldFormItem from "../ModelForm/ModelFieldFormItem";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";

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

export interface ModelTableProps {
  model?: ModelDoc;
  modelFields?: ModelFieldDoc[];
  onDeleteModelField: (modelField: ModelFieldDoc) => void;
  /**
   * 같은 프로젝트 내의 모델들
   */
  projectModels: ModelDoc[];
  /**
   * 같은 프로젝트 내의 열거형들
   */
  projectEnumerations: EnumerationDoc[];
  depth?: number;
  checkIsSubmittingModelField: (id?: string) => boolean;
  onSetEditingModelField: (id?: string) => void;
  editingModelFieldId?: string;
  onClickQuickEditModelName: (model: ModelDoc) => void;
  onSubmitModelField: (data: ModelFieldFormValues) => void;
}

const ModelTable: React.FC<ModelTableProps> = ({
  model,
  projectModels,
  depth,
  onClickQuickEditModelName,
  modelFields = [],
  onSubmitModelField,
  onDeleteModelField,
  projectEnumerations,
  checkIsSubmittingModelField,
  onSetEditingModelField,
  editingModelFieldId,
}) => {
  const classes = useStyles();

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

  const resetEditingModelField = useCallback(() => {
    onSetEditingModelField(undefined);
  }, [onSetEditingModelField]);

  const indentionPadding = useMemo(() => {
    return getIntentionPaddingByDepth(depth);
  }, [depth]);

  const addText = useMemo(() => {
    return depth ? `${model?.name}에 새로운 필드 추가` : "새로운 필드 추가";
  }, [depth, model]);

  const isNewFormVisible = useMemo(() => {
    return editingModelFieldId === "NEW";
  }, [editingModelFieldId]);

  const showNewForm = useCallback(() => {
    onSetEditingModelField("NEW");
  }, [onSetEditingModelField]);

  return (
    <Wrapper
      existingModelNames={existingModelNames}
      depth={depth}
      model={model}
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
          projectEnumerations={projectEnumerations}
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
          projectEnumerations={projectEnumerations}
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
              <Add fontSize="small" /> {addText}
            </Button>
          </TableCell>
        </TableRow>
      )}
    </Wrapper>
  );
};

type WrapperProps = Pick<
  ModelTableProps,
  "depth" | "model" | "onClickQuickEditModelName"
> & {
  existingModelNames: string[];
  children: React.ReactNode;
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
