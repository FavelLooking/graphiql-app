import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { setToken } from "../store/authSlice";
import { Dispatch } from "redux";
import { NavigateFunction } from "react-router-dom";

export const handleAuthSubmit = async (
  isLogin: boolean,
  email: string,
  password: string,
  dispatch: Dispatch,
  t: (key: string) => string,
  navigate?: NavigateFunction,
) => {
  try {
    let userCredential: UserCredential;
    if (isLogin) {
      userCredential = await signInWithEmailAndPassword(auth, email, password);
    } else {
      userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
    }

    const idTokenResult = await userCredential.user.getIdTokenResult();

    const token = idTokenResult.token;
    const expiresIn = idTokenResult.expirationTime
      ? new Date(idTokenResult.expirationTime).getTime() / 1000 -
        Date.now() / 1000
      : null;

    dispatch(
      setToken({
        token,
        email: userCredential.user.email!,
        expiresIn: expiresIn ? Math.floor(expiresIn) : 3600,
      }),
    );

    if (navigate) {
      navigate("/");
    }

    return {
      success: true,
      message: isLogin
        ? t("notifications.successLogin")
        : t("notifications.successRegister"),
    };
  } catch (error) {
    console.error(isLogin ? "Error logging in" : "Error registering", error);
    return {
      success: false,
      message: isLogin
        ? t("notifications.errorLogin")
        : t("notifications.errorRegister"),
    };
  }
};
