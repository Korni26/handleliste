import { useAuth } from "@/app/Hooks/useAuth";
import styles from "./SignInPanel.module.css";

const SignInPanel = () => {
  const { signIn } = useAuth();

  return (
    <section className={styles.card}>
      <span aria-hidden="true" className={styles.logo_icon}>🛍️</span>
      <h1>Handleliste</h1>
      <p>En enklere måte å holde oversikt over det du trenger.</p>
      <button type="button" className={styles.sign_in_button} onClick={signIn}>
        Logg inn med Google
      </button>
    </section>
  );
};

export { SignInPanel };
