import { useAuth } from "@/app/Hooks/useAuth";
import styles from "./SignInPanel.module.css";

const SignInPanel = () => {
  const { signIn } = useAuth();

  return (
    <>
      <p className={styles.logo_icon}>&#128717;</p>
      <button className={styles.sign_in_button} onClick={signIn}>
        Logg inn
      </button>
    </>
  );
};

export { SignInPanel };
