import React from "react";
import { Card, CardHeader, Divider, LinearProgress, makeStyles } from "@material-ui/core";
import Editor from "react-ace";
import YAML from "yaml";
import clsx from "clsx";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-nord_dark";
import { Oas, THEMES } from "../../../types";

const useStyles = makeStyles(() => ({
  progressBar: {
    height: 2,
    transition: "opacity 2s",
    "&.finished": {
      opacity: 0,
    },
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
      <LinearProgress
        color="secondary"
        className={clsx(classes.progressBar, { finished: progress === 100 })}
        variant="determinate"
        value={progress}
      />
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
