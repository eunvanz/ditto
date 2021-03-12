import { IconButton, SvgIcon, Tooltip } from "@material-ui/core";
import { Fullscreen, FullscreenExit } from "@material-ui/icons";
import React from "react";
import { SCREEN_MODE } from "../../../../store/Ui/UiSlice";

export interface ScreenProps {
  screenMode: SCREEN_MODE;
  onToggleScreenMode: () => void;
}

const Screen: React.FC<ScreenProps> = ({ screenMode, onToggleScreenMode }) => {
  return (
    <Tooltip
      title={screenMode === SCREEN_MODE.WIDE ? "Default screen" : "Wide screen"}
    >
      <IconButton color="inherit" onClick={onToggleScreenMode}>
        <SvgIcon fontSize="small">
          {screenMode === SCREEN_MODE.WIDE ? (
            <FullscreenExit />
          ) : (
            <Fullscreen />
          )}
        </SvgIcon>
      </IconButton>
    </Tooltip>
  );
};

export default Screen;
