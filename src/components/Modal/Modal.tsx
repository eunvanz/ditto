import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  makeStyles,
  Dialog,
  Card,
  CardHeader,
  Divider,
  CardContent,
  IconButton,
  DialogProps,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Theme } from "../../theme";

const useStyles = makeStyles((_: Theme) => ({
  cardHeader: {
    "&> .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
    },
  },
}));

export interface ModalProps extends Omit<DialogProps, "open"> {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  title,
  ...restProps
}) => {
  const classes = useStyles();

  const [hasToRender, setHasToRender] = useState(isVisible);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible) {
      setHasToRender(true);
    } else {
      // 다이얼로그가 사라지는 애니메이션 이후 컴포넌트 삭제 (200ms)
      timeoutRef.current = setTimeout(() => {
        setHasToRender(false);
      }, 200);
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return hasToRender
    ? createPortal(
        <Dialog open={isVisible} onClose={onClose} fullWidth {...restProps}>
          <Card>
            <CardHeader
              title={title}
              action={
                <IconButton size="small" onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              }
              className={classes.cardHeader}
            />
            <Divider />
            <CardContent>{children}</CardContent>
          </Card>
        </Dialog>,
        document.body,
      )
    : null;
};

export default Modal;
