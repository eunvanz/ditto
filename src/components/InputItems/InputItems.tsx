import React from "react";
import { Box, Chip, makeStyles, TextField, TextFieldProps } from "@material-ui/core";
import { Theme } from "../../theme";

const useStyles = makeStyles((theme: Theme) => ({
  itemChip: {
    marginRight: theme.spacing(1),
  },
}));

export interface InputItemsOwnProps {
  items: string[];
  onDeleteItem: (item: string) => void;
}

export type InputItemsProps = InputItemsOwnProps & TextFieldProps;

export const InputItems: React.FC<InputItemsProps> = ({
  items,
  onDeleteItem,
  ...restProps
}) => {
  const classes = useStyles();

  return (
    <>
      <Box>
        <TextField variant="outlined" fullWidth {...restProps} />
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
