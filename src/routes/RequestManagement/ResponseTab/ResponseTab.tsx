import { Box, Button, makeStyles } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React from "react";
import { Theme } from "../../../theme";

const useStyles = makeStyles((_theme: Theme) => ({
  addButton: {
    justifyContent: "start",
    textTransform: "unset",
  },
}));

export interface ResponseTabProps {}

const ResponseTab: React.FC<ResponseTabProps> = ({}) => {
  const classes = useStyles();

  return (
    <>
      <Box mt={3}>
        <Button
          className={classes.addButton}
          variant="outlined"
          color="secondary"
          fullWidth
        >
          <Add /> ADD NEW STATUS CODE
        </Button>
      </Box>
    </>
  );
};

export default ResponseTab;
