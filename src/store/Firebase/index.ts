import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

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
  firebaseReducer,
  firestoreReducer,
};

export default FirebaseSlice;
