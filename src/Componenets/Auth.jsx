import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    cookies.set("auth-token", result.user.refreshToken);
    setIsAuth(true);
  };
  return (
    <div className="auth">
      <p> Sign In With Google </p>
      <button onClick={signInWithGoogle}> Sign In With Google</button>
    </div>
  );
};
