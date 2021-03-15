import React, {
  useEffect,
  useCallback,
  useState,
  FC,
  ReactNode,
  useRef,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  TextField,
  makeStyles,
  Avatar,
  Typography,
  Button,
} from "@material-ui/core";
import { getTextFieldErrorProps } from "../../helpers/projectHelpers";
import { UserProfileDoc, MemberRole, ProjectDoc } from "../../types";
import { Theme } from "../../theme";
import { Add, Close } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) => ({
  countChip: {
    height: 18,
    marginLeft: 10,
    "&> span": {
      color: theme.palette.text.secondary,
      fontSize: "0.875rem",
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  memberName: {
    padding: 5,
    fontSize: "1rem",
  },
  outerBox: {
    justifyContent: "space-between",
  },
  moreButton: {},
  popover: {
    width: 200,
  },
  addButton: {},
  resultContainer: {
    overflow: "hidden",
    maxHeight: 400,
  },
  emptyContainer: {
    color: theme.palette.text.hint,
    padding: theme.spacing(1),
    align: "center",
    fontStyle: "italic",
  },
  email: {
    color: theme.palette.text.hint,
    marginLeft: theme.spacing(1),
  },
}));

export interface SearchUserFormProps {
  onSearch: (value: string) => void;
  resultItems?: UserProfileDoc[];
  onSubmit: (members: UserProfileDoc[], role: MemberRole) => void;
  isSubmitting: boolean;
  role: MemberRole;
  project: ProjectDoc;
}

const SearchUserForm = ({
  onSearch,
  resultItems,
  onSubmit,
  isSubmitting,
  role,
  project,
}: SearchUserFormProps) => {
  const classes = useStyles();

  const { register, errors, watch } = useForm({
    mode: "onChange",
    defaultValues: { keyword: "" },
  });

  const watchedKeyword = watch("keyword");

  const [selectedMembers, setSelectedMembers] = useState<UserProfileDoc[]>([]);

  const searchTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (watchedKeyword.length > 1) {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      searchTimeout.current = setTimeout(() => onSearch(watchedKeyword), 500);
    }
  }, [onSearch, watchedKeyword]);

  const selectMember = useCallback((member: UserProfileDoc) => {
    setSelectedMembers((members) => [...members, member]);
  }, []);

  const removeMember = useCallback((member: UserProfileDoc) => {
    setSelectedMembers((members) =>
      members.filter((item) => item.uid !== member.uid)
    );
  }, []);

  const filteredResultItem = useMemo(() => {
    return resultItems?.filter(
      (item) =>
        !selectedMembers.map((item) => item.uid).includes(item.uid) &&
        !project.members[item.uid]
    );
  }, [project.members, resultItems, selectedMembers]);

  return (
    <form>
      <Box>
        <TextField
          label="Search"
          autoFocus
          name="keyword"
          inputRef={register({
            minLength: {
              value: 2,
              message: "Please input more than 1 character.",
            },
          })}
          variant="outlined"
          fullWidth
          placeholder="email address"
          {...getTextFieldErrorProps(errors.keyword)}
        />
      </Box>
      <Box mt={3}>
        <Typography variant="h5" color="textPrimary">
          Search result
        </Typography>
        {Boolean(filteredResultItem?.length) ? (
          filteredResultItem
            ?.filter(
              (item) =>
                !selectedMembers.map((item) => item.uid).includes(item.uid)
            )
            .map((item) => (
              <MemberItem
                member={item}
                onClick={selectMember}
                buttonIcon={<Add />}
              />
            ))
        ) : (
          <div className={classes.emptyContainer}>No results</div>
        )}
      </Box>
      <Box mt={3}>
        <Typography variant="h5" color="textPrimary">
          Selected members
        </Typography>
        <div className={classes.resultContainer}>
          {selectedMembers.length > 0 ? (
            selectedMembers.map((item) => (
              <MemberItem
                member={item}
                onClick={removeMember}
                buttonIcon={<Close />}
              />
            ))
          ) : (
            <div className={classes.emptyContainer}>No one selected</div>
          )}
        </div>
      </Box>
      <Box mt={2}>
        <Button
          disabled={isSubmitting || selectedMembers.length === 0}
          fullWidth
          size="large"
          type="button"
          color="primary"
          variant="contained"
          onClick={() => onSubmit(selectedMembers, role)}
        >
          Add selected members
        </Button>
      </Box>
    </form>
  );
};

export interface MemberItemProps {
  member: UserProfileDoc;
  onClick: (member: UserProfileDoc) => void;
  buttonIcon: ReactNode;
}

export const MemberItem: FC<MemberItemProps> = ({
  member,
  onClick,
  buttonIcon,
}) => {
  const classes = useStyles();

  return (
    <>
      <Box pt={2} pb={2} display="flex" className={classes.outerBox}>
        <Box display="flex">
          <Avatar
            alt={member.name}
            src={member.photoUrl || ""}
            className={classes.avatar}
          />
          <div>
            <Typography variant="h6" color="inherit">
              {member.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {member.email}
            </Typography>
          </div>
        </Box>
        <Button className={classes.moreButton} onClick={() => onClick(member)}>
          {buttonIcon}
        </Button>
      </Box>
    </>
  );
};

export default SearchUserForm;
