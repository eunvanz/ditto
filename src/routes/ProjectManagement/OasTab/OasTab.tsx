import React from "react";
import { Card, CardHeader, Divider, LinearProgress, makeStyles } from "@material-ui/core";
import Editor from "react-ace";
import YAML from "yaml";
import { Oas, THEMES } from "../../../types";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-nord_dark";

const useStyles = makeStyles(() => ({
  progressBar: {
    height: 2,
  },
}));

export interface OasTabProps {
  data?: Oas;
  theme: THEMES;
  progress: number;
}

export const OasTab: React.FC<OasTabProps> = ({ data, theme, progress }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardHeader title="Open api spec" />
      {progress !== 100 && (
        <LinearProgress
          className={classes.progressBar}
          variant="determinate"
          value={progress}
        />
      )}
      <Divider />
      <Editor
        mode="yaml"
        theme={theme === THEMES.LIGHT ? "chrome" : "nord_dark"}
        value={YAML.stringify(JSON.parse(JSON.stringify(data)))}
        width="100%"
        height={`calc(100vh - 404px)`}
        setOptions={{ fixedWidthGutter: true }}
      />
    </Card>
  );
};

export default OasTab;
