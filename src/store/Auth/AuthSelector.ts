import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "..";
import { User } from "../../types";

const selectUser = createSelector(
  (state: RootState) => state.firebase.auth,
  (auth): User | undefined => {
    return auth.isEmpty
      ? undefined
      : {
          auth,
        };
  }
);

const selectAuth = (state: RootState) => state.firebase.auth;

const AuthSelectors = {
  selectUser,
  selectAuth,
};

export default AuthSelectors;
