import React from "react";
import SettingsTab from "./SettingsTab";
import useSettingsTabProps from "./useSettingsTabProps";

const SettingsTabContainer = () => {
  const { projectGroups, requests, request, ...restProps } = useSettingsTabProps();
  return projectGroups && requests && request ? (
    <SettingsTab
      {...restProps}
      projectGroups={projectGroups}
      requests={requests}
      request={request}
    />
  ) : null;
};

export default SettingsTabContainer;
