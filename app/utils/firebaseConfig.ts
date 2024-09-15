import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRibxZ2MYqj4cABUijRiqwLcPQjpQuhqk",
  authDomain: "rest-graphql-client-6c2e9.firebaseapp.com",
  projectId: "rest-graphql-client-6c2e9",
  storageBucket: "rest-graphql-client-6c2e9.appspot.com",
  messagingSenderId: "483302984353",
  appId: "1:483302984353:web:9b998dd354672147f43ee0",
  measurementId: "G-QC3677N6Q0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
