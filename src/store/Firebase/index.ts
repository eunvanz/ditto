import { firebaseReducer, firestoreReducer } from "react-redux-firebase";

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

export const initialFirestoreState = {
  data: {},
  errors: {
    allIds: [],
    byQuery: [],
  },
  listeners: {
    allIds: [],
    byId: {},
  },
  ordered: {},
  queries: {},
  status: {
    requested: {},
    requesting: {},
    timestamps: {},
  },
};

const FirebaseSlice = {
  firebaseReducer: firebaseReducer,
  firestoreReducer: firestoreReducer,
};

export default FirebaseSlice;
