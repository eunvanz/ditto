import React, { useState } from "react";
import { Card, CardHeader, Divider, LinearProgress, makeStyles } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Editor from "react-ace";
import YAML from "yaml";
import clsx from "clsx";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-nord_dark";
import { Oas, THEMES } from "../../../types";
import { getEditorTheme } from "../../../helpers/projectHelpers";

const useStyles = makeStyles(() => ({
  progressBar: {
    height: 2,
    transition: "opacity 2s",
    "&.finished": {
      opacity: 0,
    },
  },
  header: {
    "& .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
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

  const [format, setFormat] = useState<"yaml" | "json">("yaml");

  return (
    <Card>
      <CardHeader
        className={classes.header}
        title="Open api spec"
        action={
          <ToggleButtonGroup
            size="small"
            onChange={(_, value) => setFormat(value as "yaml" | "json")}
            exclusive
            value={format}
          >
            <ToggleButton value="yaml">YAML</ToggleButton>
            <ToggleButton value="jason">JSON</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <LinearProgress
        color="secondary"
        className={clsx(classes.progressBar, { finished: progress === 100 })}
        variant="determinate"
        value={progress}
      />
      <Divider />
      <Editor
        mode={format}
        theme={getEditorTheme(theme)}
        value={
          format === "yaml"
            ? YAML.stringify(JSON.parse(JSON.stringify(data)))
            : JSON.stringify(data, null, 2)
        }
        width="100%"
        height={`calc(100vh - ${data?.info.description ? 461 : 423}px)`}
        setOptions={{ fixedWidthGutter: true }}
      />
    </Card>
  );
};

export default OasTab;
