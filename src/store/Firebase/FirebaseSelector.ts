import { createSelector } from "@reduxjs/toolkit";
import orderBy from "lodash/orderBy";
import { RootState } from "..";
import { ProjectDoc } from "../../types";
import AuthSelectors from "../Auth/AuthSelector";

const selectMyProjects = (state: RootState) =>
  state.firestore.ordered.projects as ProjectDoc[];

const selectOrderedMyProjects = createSelector(
  selectMyProjects,
  AuthSelectors.selectAuth,
  (projects, auth) => {
    return auth
      ? orderBy(projects, [`settingsByMember.${auth.uid}.seq`], ["asc"])
      : [];
  }
);

const FirebaseSelector = {
  selectMyProjects,
  selectOrderedMyProjects,
};

export default FirebaseSelector;
