import { makeStyles } from "@material-ui/core";
import React from "react";
import Editor from "react-ace";
import { getEditorTheme } from "../../helpers/projectHelpers";
import { ModalBase, THEMES } from "../../types";
import Modal from "../Modal";
import "ace-builds/src-noconflict/mode-typescript";

const useStyles = makeStyles(() => ({
  modalRoot: {
    "& .MuiCardContent-root": {
      padding: 0,
    },
  },
}));

export interface CodeModalProps extends ModalBase {
  value: string;
  mode: string;
  theme: THEMES;
  title: string;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  value,
  mode,
  theme,
  title,
  isVisible,
  onClose,
  ...restProps
}) => {
  const classes = useStyles();

  return (
    <Modal
      className={classes.modalRoot}
      title={title}
      maxWidth="lg"
      isVisible={isVisible}
      onClose={onClose}
      {...restProps}
    >
      <Editor
        mode={mode}
        theme={getEditorTheme(theme)}
        value={value}
        width="100%"
        height={`calc(100vh - 200px)`}
        setOptions={{ fixedWidthGutter: true }}
      />
    </Modal>
  );
};

export default CodeModal;
