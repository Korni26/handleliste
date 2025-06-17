import { useAuth } from "@/app/Hooks/useAuth";
import styles from "./Header.module.css";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className={styles.header}>
      <button onClick={logout}>Logg ut </button>
      <p aria-label="Shopping bags icon" className={styles.logo_icon}>&#128717;</p>
    </header>
  );
};

export { Header };
