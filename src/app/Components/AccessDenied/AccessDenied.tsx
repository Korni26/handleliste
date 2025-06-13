import { useAuth } from "@/app/Hooks/useAuth";
import styles from "./AccessDenied.module.css";

const AccessDenied = () => {
  const { logout } = useAuth();

  return (
    <section className={styles.access_denied}>
      <p className={styles.logo_icon}>&#128717;</p>
      <h1 >Du har ikke tilgang :(</h1>
      <button className={styles.logout_button} onClick={logout}>
        Tilbake
      </button>
    </section>
  );
};

export { AccessDenied };
