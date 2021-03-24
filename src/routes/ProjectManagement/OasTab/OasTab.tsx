import React from "react";
import { Card, CardHeader, Divider } from "@material-ui/core";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-nord_dark";
import Editor from "react-ace";
import YAML from "yaml";
import { Oas, THEMES } from "../../../types";

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
        theme={theme === THEMES.LIGHT ? "github" : "nord_dark"}
        value={YAML.stringify(JSON.parse(JSON.stringify(data)))}
        width="100%"
        height={`calc(100vh - 404px)`}
        setOptions={{ fixedWidthGutter: true }}
      />
    </Card>
  );
};

export default OasTab;
