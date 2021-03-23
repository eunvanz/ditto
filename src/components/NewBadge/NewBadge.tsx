import React, { FC } from "react";
import { Theme, createStyles, withStyles, Badge, BadgeProps } from "@material-ui/core";

const StyledBadge = withStyles((_: Theme) =>
  createStyles({
    badge: {
      height: 5,
      minWidth: 5,
      borderRadius: "50%",
      top: 2,
      right: -2,
    },
  }),
)(Badge);

export interface NewBadgeProps extends BadgeProps {
  isVisible: boolean;
  children: React.ReactNode;
}

const NewBadge: FC<NewBadgeProps> = ({ isVisible, children, ...restProps }) => {
  return (
    <StyledBadge invisible={!isVisible} color="error" variant="dot" {...restProps}>
      {children}
    </StyledBadge>
  );
};

export default NewBadge;
