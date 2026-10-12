import { useAuth } from "@/app/Hooks/useAuth";
import styles from "./AccessDenied.module.css";

const AccessDenied = () => {
  const { logout } = useAuth();

  return (
    <section className={styles.access_denied}>
      <span aria-hidden="true" className={styles.logo_icon}>🔒</span>
      <h1>Du har ikke tilgang</h1>
      <p>Denne handlelisten er bare tilgjengelig for godkjente brukere.</p>
      <button type="button" className={styles.logout_button} onClick={logout}>
        Logg ut og prøv en annen konto
      </button>
    </section>
  );
};

export { AccessDenied };
