import React, { KeyboardEvent, useCallback } from "react";
import { Box, Chip, makeStyles, TextField, TextFieldProps } from "@material-ui/core";
import { Theme } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
  itemChip: {
    marginRight: theme.spacing(1),
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
  ...restProps
}) => {
  const classes = useStyles();

  const handleOnKeyUp = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
        onAddItem();
      }
    },
    [onAddItem],
  );

  return (
    <>
      <Box>
        <TextField onKeyUp={handleOnKeyUp} {...restProps} />
      </Box>
      <Box mt={1}>
        {items?.map((item) => (
          <Chip
            className={classes.itemChip}
            color="default"
            label={item}
            onDelete={() => onDeleteItem(item)}
          />
        ))}
      </Box>
    </>
  );
};

export default InputItems;
