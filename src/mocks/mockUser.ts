import { NotificationDoc, User, UserProfileDoc } from "../types";
import { FirebaseReducer } from "react-redux-firebase";

const auth: FirebaseReducer.AuthState = {
  uid: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  displayName: "이웅희",
  photoURL:
    "https://lh4.googleusercontent.com/-_ae-P8Td7mk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuck-2LHkf6uoEPzJgtBFLsO3PyX8Xg/photo.jpg",
  email: "eunvanz@gmail.com",
  emailVerified: true,
  phoneNumber: null,
  isAnonymous: false,
  providerId: "google.com",
  providerData: [
    {
      uid: "106187765517458009062",
      displayName: "이웅희",
      photoURL:
        "https://lh4.googleusercontent.com/-_ae-P8Td7mk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuck-2LHkf6uoEPzJgtBFLsO3PyX8Xg/photo.jpg",
      email: "eunvanz@gmail.com",
      phoneNumber: null,
      providerId: "google.com",
    },
  ],
  apiKey: "AIzaSyCiyEpGtkhrtsRWLYdjA5A8ECyeOf1MlJY",
  appName: "[DEFAULT]",
  authDomain: "ditto-e21bc.firebaseapp.com",
  stsTokenManager: {
    apiKey: "AIzaSyCiyEpGtkhrtsRWLYdjA5A8ECyeOf1MlJY",
    refreshToken:
      "AE0u-NeGyYrWG-8DpYFGD17evOAcDS9LeV0ojdFTG-PIH4mgxkqYz71eNHGLFOo5VVl0PE_iq-VsxlZho3gcY0PvUcm0BKIpg1MIiYE7DNsXybZ8YRBoL91I6ARxqXb3JPhPqNI4zDq2f9JfZ5gER2h477nEQ8uVXDZUiOwcyABdGmLPfvAfq6Rkt9VB-KzPjUxzCXs8iQyYlNCBCZzXq-LQxEm6AtonEOeB1dC3IrzO9v3sUx0IUTOu8BCf2TLje-Y_fuf6bjPQ58OJDtGCQ-T7mtIj11ZL1J8nYa4_82sLi3y7h3Mpjwq75-3Ekep4nDVEGqUUGA31uVl29sKCBpj5BiZlI1PVbbd_1Oai_H1rVZZThnSzfwb8hAQWU9R3Eo3Drn_1pAo0WmETeVSPL4K0GWlsmPTVic1KU9Wh_sfTwVBrNHccP8zYye2PzDF-RCWFGkaIId9s",
    accessToken:
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlNjYzOGY4NDlkODVhNWVkMGQ1M2NkNDI1MzE0Y2Q1MGYwYjY1YWUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi7J207JuF7Z2sIiwicGljdHVyZSI6Imh0dHBzOi8vbGg0Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tX2FlLVA4VGQ3bWsvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQU1adXVjay0yTEhrZjZ1b0VQekpndEJGTHNPM1B5WDhYZy9waG90by5qcGciLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZGl0dG8tZTIxYmMiLCJhdWQiOiJkaXR0by1lMjFiYyIsImF1dGhfdGltZSI6MTYwMDk0NzEzNSwidXNlcl9pZCI6ImFZTVRyQ2lURTdhdkNZMXllTkhWdDlYSFg0TjIiLCJzdWIiOiJhWU1UckNpVEU3YXZDWTF5ZU5IVnQ5WEhYNE4yIiwiaWF0IjoxNjAxMTA3NjU2LCJleHAiOjE2MDExMTEyNTYsImVtYWlsIjoiZXVudmFuekBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNjE4Nzc2NTUxNzQ1ODAwOTA2MiJdLCJlbWFpbCI6WyJldW52YW56QGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.eXWQ5ZKtAqxmFD_-2C9wyIWY2Wx-SYWyJEVYmZU1-XwsxhsX_FRJYpJI1Kvb_dznnXoddfWngqrD-_FYaXv98cN928XH-kq__JdjESVT6sBu38dNwS5Af7S8NFrw2blD-wgMSCOVhjSJbfO-kx8oyxJnR4bFSWvbGbD7dK9adv9A8BWxuwNkfbmleA_NcM7VlOZpwudQWuHi2sTBoIU2ugoqwy1pryTi7vj6D9Yc9ReZ9DUGXTAI_BBBPKZzfsNGJ9SlgONzWWJa51j3ihqLpbszD192KF0U0kybHMv5g_gXjr9PRD4uTphIEEPHL_gW_eCv1bB0Q90PUA1ndnkmAg",
    expirationTime: 1601111256000,
  },
  redirectEventId: null,
  lastLoginAt: "1600947135319",
  createdAt: "1600947135319",
  isEmpty: false,
  isLoaded: true,
};

const user: User = {
  auth,
};

const profile = {
  id: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  registeredAt: {
    seconds: 1615295982,
    nanoseconds: 49000000,
  },
  name: "이웅희",
  email: "eunvanz@gmail.com",
  isRegistered: true,
  updatedAt: {
    seconds: 1615295982,
    nanoseconds: 49000000,
  },
  photoUrl:
    "https://lh4.googleusercontent.com/-_ae-P8Td7mk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuck-2LHkf6uoEPzJgtBFLsO3PyX8Xg/photo.jpg",
  uid: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  isLoaded: true,
  isEmpty: false,
};

const userProfiles: UserProfileDoc[] = [
  {
    id: "wzfu1bIUNHgsVR7ALvjQaBefsbm2",
    isRegistered: true,
    photoUrl:
      "https://lh5.googleusercontent.com/-vRIDoLqDkqg/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmIzwJUXZy6lTf5pySGYtf21gFgjw/s96-c/photo.jpg",
    name: "김춘택johnnie.k",
    uid: "wzfu1bIUNHgsVR7ALvjQaBefsbm2",
    registeredAt: {
      seconds: 1615276084,
      nanoseconds: 310000000,
    },
    updatedAt: {
      seconds: 1615276084,
      nanoseconds: 310000000,
    },
    email: "johnnie.k@kakaopaycorp.com",
  },
  {
    id: "NXIaHP23brPZPD6eouQB674MhJC2",
    name: "나유리nana.na",
    uid: "NXIaHP23brPZPD6eouQB674MhJC2",
    email: "nana.na@kakaopaycorp.com",
    registeredAt: {
      seconds: 1615276002,
      nanoseconds: 426000000,
    },
    updatedAt: {
      seconds: 1615276002,
      nanoseconds: 426000000,
    },
    photoUrl:
      "https://lh6.googleusercontent.com/-5Hat10-py2k/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclcbh402PIE-F8BKfT0I59fMWSeBw/s96-c/photo.jpg",
    isRegistered: true,
  },
  {
    id: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    registeredAt: {
      seconds: 1615295982,
      nanoseconds: 49000000,
    },
    name: "이웅희",
    email: "eunvanz@gmail.com",
    isRegistered: true,
    updatedAt: {
      seconds: 1615295982,
      nanoseconds: 49000000,
    },
    photoUrl:
      "https://lh4.googleusercontent.com/-_ae-P8Td7mk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuck-2LHkf6uoEPzJgtBFLsO3PyX8Xg/photo.jpg",
    uid: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  },
  {
    id: "HSdAB8kHlwWxE2Aa7LnOIoCZywl1",
    name: "이웅희benjamin.js",
    photoUrl:
      "https://lh6.googleusercontent.com/-Ozx32kVRJP4/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckvCAea6PtJKtkQHD0AcimgwPVYCQ/s96-c/photo.jpg",
    isRegistered: true,
    email: "benjamin.js@kakaopaycorp.com",
    registeredAt: {
      seconds: 1615276665,
      nanoseconds: 906000000,
    },
    updatedAt: {
      seconds: 1615276665,
      nanoseconds: 906000000,
    },
    uid: "HSdAB8kHlwWxE2Aa7LnOIoCZywl1",
  },
  {
    id: "11DGevSL0wOKp7kXQFcKdhJil3E2",
    isRegistered: true,
    updatedAt: {
      seconds: 1615256184,
      nanoseconds: 456000000,
    },
    email: "zeroth.law@kakaopaycorp.com",
    photoUrl:
      "https://lh6.googleusercontent.com/-aYE_S1nrMkA/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckAm9bnzFLbVopbOxwY7KgR_zbBFQ/s96-c/photo.jpg",
    registeredAt: {
      seconds: 1615256184,
      nanoseconds: 456000000,
    },
    uid: "11DGevSL0wOKp7kXQFcKdhJil3E2",
    name: "정영수zeroth.law",
  },
];

const notifications: NotificationDoc[] = [
  {
    id: "mockId",
    title: "Pet Store",
    content: "You've been added as manager of project by Benjamin.",
    userId: "mockId",
    link: "/test",
    isRead: false,
    updatedAt: {
      seconds: 1601177065,
      nanoseconds: 409000000,
    },
    createdAt: {
      seconds: 1601176525,
      nanoseconds: 902000000,
    },
    createdBy: "mockId",
    updatedBy: "mockId",
  },
];

const mockUser = {
  user,
  auth,
  userProfiles,
  notifications,
  profile,
};

export default mockUser;
