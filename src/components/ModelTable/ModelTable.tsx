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
  buttonCell: {
    width: 60,
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

export type ModelTableColumns =
  | "fieldName"
  | "isRequired"
  | "isArray"
  | "fieldType"
  | "format"
  | "enum"
  | "description";

export interface ModelTableProps {
  model?: ModelDoc;
  modelFields?: ModelFieldDoc[];
  onDeleteModelFieldCustom?: (modelField: ModelFieldDoc) => void;
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
  checkIsSubmittingModelFieldCustom?: (id?: string) => boolean;
  checkIsSubmittingModelField: (id?: string) => boolean;
  onSetEditingModelField: (id?: string) => void;
  editingModelFieldId?: string;
  onClickQuickEditModelName: (model: ModelDoc) => void;
  onSubmitModelFieldCustom?: (data: ModelFieldFormValues) => void;
  onSubmitModelField: (data: ModelFieldFormValues) => void;
  onShowNewForm?: () => void;
  checkIsNewFormDisabled?: () => boolean;
  customFieldName?: string;
  hiddenColumns?: ModelTableColumns[];
}

const ModelTable: React.FC<ModelTableProps> = ({
  model,
  projectModels,
  depth,
  onClickQuickEditModelName,
  modelFields = [],
  onSubmitModelField,
  onSubmitModelFieldCustom,
  onDeleteModelField,
  onDeleteModelFieldCustom,
  projectEnumerations,
  checkIsSubmittingModelField,
  checkIsSubmittingModelFieldCustom,
  onSetEditingModelField,
  editingModelFieldId,
  onShowNewForm,
  checkIsNewFormDisabled,
  customFieldName,
  hiddenColumns,
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
    return depth
      ? `ADD NEW FIELD TO ${model?.name}`
      : `ADD NEW ${customFieldName?.toUpperCase() || "FIELD"}`;
  }, [customFieldName, depth, model]);

  const isNewFormVisible = useMemo(() => {
    return editingModelFieldId === "NEW";
  }, [editingModelFieldId]);

  const showNewForm = useCallback(() => {
    onShowNewForm?.();
    if (!checkIsNewFormDisabled?.()) {
      onSetEditingModelField("NEW");
    }
  }, [checkIsNewFormDisabled, onSetEditingModelField, onShowNewForm]);

  return (
    <Wrapper
      existingModelNames={existingModelNames}
      depth={depth}
      model={model}
      onClickQuickEditModelName={onClickQuickEditModelName}
      customFieldName={customFieldName}
      hiddenColumns={hiddenColumns}
    >
      {modelFields.map((modelField) => (
        <ModelFieldFormItem
          key={modelField.id}
          modelFields={modelFields}
          modelField={modelField}
          onSubmit={
            depth
              ? onSubmitModelField
              : onSubmitModelFieldCustom || onSubmitModelField
          }
          onDelete={() =>
            depth
              ? onDeleteModelField(modelField)
              : (onDeleteModelFieldCustom || onDeleteModelField)(modelField)
          }
          projectModels={projectModels}
          projectEnumerations={projectEnumerations}
          depth={depth}
          isSubmitting={
            depth
              ? checkIsSubmittingModelField(modelField.id)
              : (
                  checkIsSubmittingModelFieldCustom ||
                  checkIsSubmittingModelField
                )(modelField.id)
          }
          onClickCell={() => onSetEditingModelField(modelField.id)}
          isFormVisible={editingModelFieldId === modelField.id}
          onCancel={resetEditingModelField}
          hiddenColumns={hiddenColumns}
          customFieldName={customFieldName}
        />
      ))}
      {isNewFormVisible ? (
        <ModelFieldFormItem
          modelFields={modelFields}
          onSubmit={
            depth
              ? onSubmitModelField
              : onSubmitModelFieldCustom || onSubmitModelField
          }
          isFormVisible
          projectModels={projectModels}
          projectEnumerations={projectEnumerations}
          depth={depth}
          onCancel={resetEditingModelField}
          isSubmitting={
            depth
              ? checkIsSubmittingModelField()
              : (
                  checkIsSubmittingModelFieldCustom ||
                  checkIsSubmittingModelField
                )()
          }
          hiddenColumns={hiddenColumns}
          customFieldName={customFieldName}
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
  | "depth"
  | "model"
  | "onClickQuickEditModelName"
  | "customFieldName"
  | "hiddenColumns"
> & {
  existingModelNames: string[];
  children: React.ReactNode;
};

const Wrapper: React.FC<WrapperProps> = ({
  depth,
  model,
  children,
  onClickQuickEditModelName,
  customFieldName,
  hiddenColumns,
}) => {
  const classes = useStyles();

  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const indentionPadding = useMemo(() => {
    return getIntentionPaddingByDepth(depth);
  }, [depth]);

  const getHiddenColumnStyle = useCallback(
    (column: ModelTableColumns) => {
      if (hiddenColumns?.includes(column)) {
        return { display: "none" };
      } else {
        return undefined;
      }
    },
    [hiddenColumns]
  );

  if (!depth) {
    return (
      <Table stickyHeader size="small">
        <caption />
        <TableHead>
          <TableRow>
            <TableCell
              component="th"
              className={classes.fieldNameCell}
              style={getHiddenColumnStyle("fieldName")}
            >
              {customFieldName ? `${customFieldName}*` : "Field name*"}
            </TableCell>
            <TableCell
              align="center"
              className={classes.requiredCell}
              style={getHiddenColumnStyle("isRequired")}
            >
              Required
            </TableCell>
            <TableCell
              align="center"
              className={classes.arrayCell}
              style={getHiddenColumnStyle("isArray")}
            >
              Array
            </TableCell>
            <TableCell
              className={classes.typeCell}
              style={getHiddenColumnStyle("fieldType")}
            >
              Type*
            </TableCell>
            <TableCell
              className={classes.formatCell}
              style={getHiddenColumnStyle("format")}
            >
              Format
            </TableCell>
            <TableCell
              className={classes.formatCell}
              style={getHiddenColumnStyle("enum")}
            >
              Enumeration
            </TableCell>
            <TableCell style={getHiddenColumnStyle("description")}>
              Description
            </TableCell>
            <TableCell align="right" className={classes.buttonCell}></TableCell>
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
                  <ExpandMore fontSize="small" /> {model?.name}
                </>
              )}
              {isDetailVisible && (
                <>
                  <ExpandLess fontSize="small" /> {model?.name}
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
