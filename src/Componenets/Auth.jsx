import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";

export const Auth = ({ setIsAuth }) => {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, provider);
    setIsAuth(true);
  };
  return (
    <div className="auth">
      <p> Sign In With Google </p>
      <button onClick={signInWithGoogle}> Sign In</button>
    </div>
  );
};
