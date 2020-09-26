import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCiyEpGtkhrtsRWLYdjA5A8ECyeOf1MlJY",
  authDomain: "ditto-e21bc.firebaseapp.com",
  databaseURL: "https://ditto-e21bc.firebaseio.com",
  projectId: "ditto-e21bc",
  storageBucket: "ditto-e21bc.appspot.com",
  messagingSenderId: "738188473066",
  appId: "1:738188473066:web:655ac9c484277d3f695d93",
  measurementId: "G-H2YRKPH7XS",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const getTimestamp = firebase.firestore.FieldValue.serverTimestamp;
