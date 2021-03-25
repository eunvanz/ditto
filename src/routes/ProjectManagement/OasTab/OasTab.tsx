import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Divider,
  FormControl,
  LinearProgress,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";
import Editor from "react-ace";
import YAML from "yaml";
import clsx from "clsx";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-json";
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
          <FormControl size="small">
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value as "yaml" | "json")}
            >
              <MenuItem value="yaml">YAML</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
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
        theme={theme === THEMES.LIGHT ? "chrome" : "nord_dark"}
        value={
          format === "yaml"
            ? YAML.stringify(JSON.parse(JSON.stringify(data)))
            : JSON.stringify(data, null, 2)
        }
        width="100%"
        height={`calc(100vh - 404px)`}
        setOptions={{ fixedWidthGutter: true }}
      />
    </Card>
  );
};

export default OasTab;
