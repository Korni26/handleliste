import { useAuth } from "@/app/Hooks/useAuth";
import styles from "./Header.module.css";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span aria-hidden="true" className={styles.logo_icon}>🛍️</span>
        <span className={styles.brand_name}>Handleliste</span>
      </div>
      <button type="button" onClick={logout}>Logg ut</button>
    </header>
  );
};

export { Header };
