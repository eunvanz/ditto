import { Box, Button, makeStyles, TextField } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";
import Editor from "react-ace";
import { convertInterfaceToMockData, getEditorTheme } from "../../helpers/projectHelpers";
import { EnumerationDoc, Interface, ModalBase, THEMES } from "../../types";
import Modal from "../Modal";
import { Theme } from "../../theme";
import "ace-builds/src-noconflict/mode-json";

const useStyles = makeStyles((theme: Theme) => ({
  modalRoot: {
    "& .MuiCardContent-root": {
      padding: 0,
    },
    "& .MuiButton-root": {
      padding: "8px 16px",
    },
  },
  lengthInput: {
    marginLeft: theme.spacing(2),
    width: 120,
  },
  generateBtn: {
    marginLeft: theme.spacing(2),
  },
}));

export interface MockDataModalProps extends ModalBase {
  theme: THEMES;
  targetInterface?: Interface;
  interfaces: Interface[];
  enumerations: EnumerationDoc[];
}

export const MockDataModal: React.FC<MockDataModalProps> = ({
  theme,
  targetInterface,
  interfaces,
  enumerations,
  ...restProps
}) => {
  const classes = useStyles();

  const [isArray, setIsArray] = useState(false);

  const [length, setLength] = useState(3);

  const [result, setResult] = useState();

  const generateMock = useCallback(() => {
    if (!targetInterface) {
      return;
    }
    let result;
    if (isArray) {
      result = [];
      Array.from({ length }).forEach(() => {
        result.push(
          convertInterfaceToMockData({
            targetInterface,
            interfaces,
            enumerations,
          }),
        );
      });
    } else {
      result = convertInterfaceToMockData({
        targetInterface,
        interfaces,
        enumerations,
      });
    }
    setResult(result);
  }, [enumerations, interfaces, isArray, length, targetInterface]);

  useEffect(() => {
    if (!restProps.isVisible) {
      return () => {
        setIsArray(false);
        setLength(3);
        setResult(undefined);
      };
    } else {
      targetInterface &&
        setResult(
          convertInterfaceToMockData({ targetInterface, interfaces, enumerations }),
        );
    }
  }, [enumerations, interfaces, restProps.isVisible, targetInterface]);

  return (
    <Modal
      className={classes.modalRoot}
      title="JSON mock data"
      maxWidth="lg"
      {...restProps}
    >
      <Box padding={2}>
        <ToggleButtonGroup
          size="small"
          onChange={(_, value) => setIsArray(value)}
          exclusive
          value={isArray}
        >
          <ToggleButton value={false}>Single</ToggleButton>
          <ToggleButton value={true}>Array</ToggleButton>
        </ToggleButtonGroup>
        {isArray && (
          <TextField
            className={classes.lengthInput}
            label="Length"
            size="small"
            value={length}
            type="number"
            onChange={(e) => setLength(Number(e.target.value))}
            variant="outlined"
          />
        )}
        <Button
          className={classes.generateBtn}
          variant="contained"
          color="secondary"
          onClick={generateMock}
        >
          Generate
        </Button>
      </Box>
      <Editor
        mode="json"
        theme={getEditorTheme(theme)}
        width="100%"
        height={`calc(100vh - 200px)`}
        setOptions={{ fixedWidthGutter: true }}
        value={JSON.stringify(result, null, 2)}
      />
    </Modal>
  );
};

export default MockDataModal;
