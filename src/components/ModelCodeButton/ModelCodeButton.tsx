import { Button, ButtonProps, Menu, MenuItem } from "@material-ui/core";
import { Code } from "@material-ui/icons";
import React, { FC, useCallback, useRef, useState } from "react";
import useModelCodes from "../../hooks/useModelCodes";
import { ModelDoc } from "../../types";

export interface ModelCodeButtonProps extends ButtonProps {
  model: ModelDoc;
}

export const ModelCodeButton: FC<ModelCodeButtonProps> = ({ model, ...restProps }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback((e: Event) => {
    e.stopPropagation();
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((isMenuOpen) => !isMenuOpen);
  }, []);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { onShowMockDataModal, onShowTypescriptInterfaceModal } = useModelCodes(model);

  const showMockDataModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      onShowMockDataModal();
    },
    [onShowMockDataModal],
  );

  const showTypescriptInterfaceModal = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      onShowTypescriptInterfaceModal();
    },
    [onShowTypescriptInterfaceModal],
  );

  return (
    <>
      <Button {...restProps} ref={buttonRef} onClick={toggleMenu}>
        <Code fontSize="small" />
      </Button>
      <Menu
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        getContentAnchorEl={null}
        anchorEl={buttonRef.current}
        open={isMenuOpen}
      >
        <MenuItem onClick={showMockDataModal}>JSON mock data</MenuItem>
        <MenuItem onClick={showTypescriptInterfaceModal}>Typescript interface</MenuItem>
      </Menu>
    </>
  );
};

export default ModelCodeButton;
