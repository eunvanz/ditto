import React, { useCallback, ChangeEvent } from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from "@material-ui/core";
import StarBorder from "@material-ui/icons/StarBorder";
import Star from "@material-ui/icons/Star";

export interface ProjectListItemProps {
  title: string;
  isStarred?: boolean;
  hasNewBadge?: boolean;
  apiCount: number;
  onClick: () => void;
  onChangeStar: (isStarred: boolean) => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  title,
  isStarred = false,
  hasNewBadge = false,
  apiCount,
  onClick,
  onChangeStar,
}) => {
  const handleOnChangeStar = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChangeStar(e.target.checked);
    },
    [onChangeStar]
  );

  return (
    <ListItem>
      <ListItemText primary={title} />
      <ListItemSecondaryAction>
        <Checkbox
          icon={<StarBorder />}
          checkedIcon={<Star />}
          onChange={handleOnChangeStar}
          defaultChecked={isStarred}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ProjectListItem;
