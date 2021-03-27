import React from "react";
import { Box, TextField } from "@material-ui/core";

export interface InputItemsProps {
  items?: string[] | number[];
  type: "string" | "number";
}

export const InputItems: React.FC<InputItemsProps> = ({ items, type }) => {
  return (
    <>
      <Box>
        <TextField />
      </Box>
    </>
  );
};

export default InputItems;
