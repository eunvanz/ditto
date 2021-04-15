import React, { KeyboardEvent, useCallback, useState } from "react";
import {
  Box,
  Button,
  Chip,
  makeStyles,
  Paper,
  TextField,
  TextFieldProps,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { Theme } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
  itemChip: {
    margin: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0,
  },
  textWrapper: {
    display: "flex",
  },
  addButton: {
    marginLeft: theme.spacing(1),
    width: 100,
    height: 56,
    "&.flat": {
      width: 80,
      height: 28,
    },
  },
  itemsPaper: {
    paddingBottom: theme.spacing(1),
    background: theme.palette.background.dark,
  },
  noItemsWrapper: {
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
}));

export interface InputItemsOwnProps {
  items: string[];
  onAddItem: () => void;
  onDeleteItem: (item: string) => void;
}

export type InputItemsProps = InputItemsOwnProps & TextFieldProps;

export const InputItems: React.FC<InputItemsProps> = ({
  items,
  onAddItem,
  onDeleteItem,
  variant,
  ...restProps
}) => {
  const classes = useStyles();

  const handleOnKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (e.key === "Enter") {
        onAddItem();
      }
    },
    [onAddItem],
  );

  const [buttonColor, setButtonColor] = useState<"secondary" | undefined>(undefined);

  return (
    <>
      <Box className={classes.textWrapper}>
        <TextField
          onKeyDown={(e) => {
            // 엔터키로 form submit 하지 않음
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
          onKeyUp={handleOnKeyUp}
          autoComplete="off"
          variant={variant}
          onFocus={() => setButtonColor("secondary")}
          onBlur={() => setButtonColor(undefined)}
          {...restProps}
        />
        <Button
          onClick={onAddItem}
          className={clsx(classes.addButton, { flat: !variant })}
          variant={buttonColor ? "contained" : "outlined"}
          color={buttonColor}
        >
          Add
        </Button>
      </Box>
      <Box mt={1}>
        <Paper className={classes.itemsPaper} elevation={0}>
          {items?.length ? (
            items.map((item) => (
              <Chip
                key={item}
                className={classes.itemChip}
                color="default"
                label={item}
                onDelete={() => onDeleteItem(item)}
                variant="outlined"
              />
            ))
          ) : (
            <div className={classes.noItemsWrapper}>
              <Typography component="i" color="textSecondary">
                No items
              </Typography>
            </div>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default InputItems;
