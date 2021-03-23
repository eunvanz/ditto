import React from "react";
import { Card, CardHeader, Divider } from "@material-ui/core";
import { Oas, THEMES } from "../../../types";
import YAML from "yaml";
import Editor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-yaml";

export interface OasTabProps {
  data?: Oas;
  theme: THEMES;
}

export const OasTab: React.FC<OasTabProps> = ({ data, theme }) => {
  return (
    <Card>
      <CardHeader title="Open API spec" />
      <Divider />
      <Editor
        mode="yaml"
        theme={theme === THEMES.LIGHT ? "github" : "monokai"}
        value={YAML.stringify(JSON.parse(JSON.stringify(data)))}
        width="100%"
        height={`calc(100vh - 400px)`}
      />
    </Card>
  );
};

export default OasTab;
