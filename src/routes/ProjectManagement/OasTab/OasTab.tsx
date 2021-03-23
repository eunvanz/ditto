import React from "react";
import { Card, CardHeader, Divider } from "@material-ui/core";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Oas, THEMES } from "../../../types";
import YAML from "yaml";
import dark from "react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark";
import light from "react-syntax-highlighter/dist/esm/styles/hljs/vs";

export interface OasTabProps {
  data?: Oas;
  theme: THEMES;
}

export const OasTab: React.FC<OasTabProps> = ({ data, theme }) => {
  return (
    <Card>
      <CardHeader title="Open API spec" />
      <Divider />
      <SyntaxHighlighter
        language="yaml"
        showLineNumbers
        wrapLongLines
        style={theme === THEMES.DARK ? dark : light}
      >
        {/** null을 없애기 위해 JSON.stringify 후 parse */}
        {YAML.stringify(JSON.parse(JSON.stringify(data)))}
      </SyntaxHighlighter>
      <SyntaxHighlighter
        language="json"
        showLineNumbers
        wrapLongLines
        style={theme === THEMES.DARK ? dark : light}
      >
        {JSON.stringify(data, null, 2)}
      </SyntaxHighlighter>
    </Card>
  );
};

export default OasTab;
