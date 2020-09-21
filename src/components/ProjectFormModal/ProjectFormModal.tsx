import React from "react";
import {
  Dialog,
  Card,
  CardHeader,
  Divider,
  CardContent,
  IconButton,
  makeStyles,
  Theme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ProjectForm from "../ProjectForm";

const useStyles = makeStyles((_: Theme) => ({
  cardHeader: {
    "&> .MuiCardHeader-action": {
      marginTop: 0,
      marginRight: 0,
    },
  },
}));

export interface ProjectFormModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isVisible,
  onClose,
}) => {
  const classes = useStyles();

  return (
    <Dialog open={isVisible} onClose={onClose} fullWidth>
      <Card>
        <CardHeader
          title="새 프로젝트"
          action={
            <IconButton size="small">
              <CloseIcon />
            </IconButton>
          }
          className={classes.cardHeader}
        />
        <Divider />
        <CardContent>
          <ProjectForm />
        </CardContent>
      </Card>
    </Dialog>
  );
};

export default ProjectFormModal;
