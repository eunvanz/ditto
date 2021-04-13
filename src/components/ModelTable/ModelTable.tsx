import {
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { EditOutlined, ArrowDropDown, ArrowRight, Add, Code } from "@material-ui/icons";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  checkHasAuthorization,
  checkHasUpdatedFields,
  commonStyles,
  getButtonIndentionPaddingByDepth,
} from "../../helpers/projectHelpers";
import { Theme } from "../../theme";
import {
  EnumerationDoc,
  MemberRole,
  ModelDoc,
  ModelFieldDoc,
  UserProfileDoc,
} from "../../types";
import ModelFieldFormItem, {
  ModelFieldFormItemProps,
} from "../ModelForm/ModelFieldFormItem";
import { ModelFieldFormValues } from "../ModelForm/ModelForm";
import { EXAMPLE_PROJECT_ID } from "../../constants";

const useStyles = makeStyles((theme: Theme) => ({
  fieldNameCell: {
    width: "17%",
  },
  typeCell: {
    width: 100,
  },
  arrayCell: {
    width: 50,
  },
  formatCell: {
    width: "17%",
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
  subButton: {
    color: theme.palette.text.secondary,
  },
  updatedFieldCell: commonStyles.updatedFieldCell,
  modelName: {
    marginRight: 10,
  },
}));

export type ModelTableProps = {
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
  role: MemberRole;
  userProfile: UserProfileDoc;
  onShowMockDataModal: () => void;
  onShowTypescriptInterfaceModal: () => void;
} & Pick<
  ModelFieldFormItemProps,
  | "customFieldName"
  | "disabledColumns"
  | "customFieldNameInput"
  | "onShowQuickEnumFormModal"
  | "onRefreshModelField"
  | "isExampleAvailable"
  | "onClickExample"
>;

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
  disabledColumns,
  customFieldNameInput,
  role,
  userProfile,
  onRefreshModelField,
  onShowQuickEnumFormModal,
  isExampleAvailable,
  onClickExample,
  onShowMockDataModal,
  onShowTypescriptInterfaceModal,
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

  const buttonIndentionPadding = useMemo(() => {
    return getButtonIndentionPaddingByDepth(depth ? depth + 1 : undefined);
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

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

  return (
    <Wrapper
      existingModelNames={existingModelNames}
      depth={depth}
      model={model}
      onClickQuickEditModelName={onClickQuickEditModelName}
      customFieldName={customFieldName}
      disabledColumns={disabledColumns}
      role={role}
      modelFields={modelFields}
      userProfile={userProfile}
      onShowMockDataModal={onShowMockDataModal}
      onShowTypescriptInterfaceModal={onShowTypescriptInterfaceModal}
    >
      {modelFields.map((modelField) => (
        <ModelFieldFormItem
          key={modelField.id}
          modelFields={modelFields}
          modelField={modelField}
          onSubmit={
            depth ? onSubmitModelField : onSubmitModelFieldCustom || onSubmitModelField
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
              : (checkIsSubmittingModelFieldCustom || checkIsSubmittingModelField)(
                  modelField.id,
                )
          }
          onClickCell={
            hasManagerAuthorization
              ? () => onSetEditingModelField(modelField.id)
              : () => {}
          }
          isFormVisible={editingModelFieldId === modelField.id}
          onCancel={resetEditingModelField}
          disabledColumns={disabledColumns}
          customFieldName={customFieldName}
          customFieldNameInput={customFieldNameInput}
          role={role}
          userProfile={userProfile}
          onRefreshModelField={onRefreshModelField}
          onShowQuickEnumFormModal={onShowQuickEnumFormModal}
          isExampleAvailable={isExampleAvailable}
          onClickExample={onClickExample}
        />
      ))}
      {hasManagerAuthorization && (
        <>
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
                  : (checkIsSubmittingModelFieldCustom || checkIsSubmittingModelField)()
              }
              disabledColumns={disabledColumns}
              customFieldName={customFieldName}
              customFieldNameInput={customFieldNameInput}
              role={role}
              userProfile={userProfile}
              onRefreshModelField={onRefreshModelField}
              onShowQuickEnumFormModal={onShowQuickEnumFormModal}
              isExampleAvailable={isExampleAvailable}
              onClickExample={onClickExample}
            />
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                style={{ paddingLeft: buttonIndentionPadding, paddingRight: 4 }}
              >
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
        </>
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
  | "disabledColumns"
  | "role"
  | "modelFields"
  | "userProfile"
  | "onShowMockDataModal"
  | "onShowTypescriptInterfaceModal"
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
  role,
  modelFields,
  userProfile,
  onShowMockDataModal,
  onShowTypescriptInterfaceModal,
}) => {
  const classes = useStyles();

  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const indentionPadding = useMemo(() => {
    return getButtonIndentionPaddingByDepth(depth);
  }, [depth]);

  const hasManagerAuthorization = useMemo(() => {
    return checkHasAuthorization(role, "manager");
  }, [role]);

  const hasUpdatedFields = useMemo(() => {
    return !!modelFields && checkHasUpdatedFields(modelFields, userProfile.uid);
  }, [modelFields, userProfile.uid]);

  if (!depth) {
    return (
      <Table stickyHeader size="small">
        <caption />
        <TableHead>
          <TableRow>
            <TableCell component="th" className={classes.fieldNameCell}>
              {customFieldName ? `${customFieldName}*` : "Field name*"}
            </TableCell>
            <TableCell align="center" className={classes.requiredCell}>
              Required
            </TableCell>
            <TableCell align="center" className={classes.arrayCell}>
              Array
            </TableCell>
            <TableCell className={classes.typeCell}>Type*</TableCell>
            <TableCell className={classes.formatCell}>Format</TableCell>
            <TableCell className={classes.formatCell}>Enumeration</TableCell>
            <TableCell>Description</TableCell>
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
          <TableCell
            colSpan={8}
            style={{ paddingLeft: indentionPadding, paddingRight: 4 }}
            className={
              hasUpdatedFields && model?.projectId !== EXAMPLE_PROJECT_ID
                ? classes.updatedFieldCell
                : undefined
            }
          >
            <Button
              className={classes.addButton}
              fullWidth
              color="secondary"
              onClick={() => setIsDetailVisible(!isDetailVisible)}
            >
              {!isDetailVisible && (
                <>
                  <ArrowRight fontSize="small" />
                  <span className={classes.modelName}>{model?.name}</span>
                </>
              )}
              {isDetailVisible && (
                <>
                  <ArrowDropDown fontSize="small" />
                  <span className={classes.modelName}>{model?.name}</span>
                  {hasManagerAuthorization && (
                    <Button
                      className={classes.subButton}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClickQuickEditModelName(model!);
                      }}
                    >
                      <EditOutlined fontSize="small" />
                    </Button>
                  )}
                </>
              )}
              {model && (
                <CodeButton
                  onShowMockDataModal={onShowMockDataModal}
                  onShowTypescriptInterfaceModal={onShowTypescriptInterfaceModal}
                />
              )}
            </Button>
          </TableCell>
        </TableRow>
        {isDetailVisible ? children : null}
      </>
    );
  }
};

type CodeButtonProps = Pick<
  ModelTableProps,
  "onShowMockDataModal" | "onShowTypescriptInterfaceModal"
>;

const CodeButton: React.FC<CodeButtonProps> = ({
  onShowMockDataModal,
  onShowTypescriptInterfaceModal,
}) => {
  const classes = useStyles();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback((e: Event) => {
    e.stopPropagation();
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((isMenuOpen) => !isMenuOpen);
  }, []);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const showMockDataModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      onShowMockDataModal();
    },
    [onShowMockDataModal],
  );

  const showTypescriptInterfaceModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      onShowTypescriptInterfaceModal();
    },
    [onShowTypescriptInterfaceModal],
  );

  return (
    <>
      <Button
        className={classes.subButton}
        size="small"
        ref={buttonRef}
        onClick={toggleMenu}
      >
        <Code fontSize="small" />
      </Button>
      <Menu
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
        anchorEl={buttonRef.current}
        open={isMenuOpen}
      >
        <MenuItem onClick={showMockDataModal}>JSON mock data</MenuItem>
        <MenuItem onClick={showTypescriptInterfaceModal}>Typescript interface</MenuItem>
      </Menu>
    </>
  );
};

export default ModelTable;
