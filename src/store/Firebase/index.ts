import { firebaseReducer } from "react-redux-firebase";

export const initialFirebaseState = {
  requesting: {},
  requested: {},
  timestamps: {},
  data: {},
  ordered: {},
  auth: {
    isLoaded: false,
    isEmpty: true,
  },
  authError: null,
  profile: {
    isLoaded: false,
    isEmpty: true,
  },
  listeners: {
    byId: {},
    allIds: [],
  },
  isInitializing: false,
  errors: [],
};

const FirebaseSlice = {
  reducer: firebaseReducer,
};

export default FirebaseSlice;
