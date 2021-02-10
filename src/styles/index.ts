import { Theme } from "@material-ui/core";

export const getDangerButtonStyle = (theme: Theme) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.error.main,
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
});
