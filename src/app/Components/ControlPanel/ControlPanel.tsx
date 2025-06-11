import styles from "./ControlPanel.module.css";

const ControlPanel = () => {
  return (
    <div className={styles.control_panel}>
      <div className={styles.adding_input}>
        <input type="text" placeholder="Produktnavn" />
        <button className={styles.accept_button}>&#9932;</button>
      </div>
      <button className={styles.delete_button}>&#9932;</button>
    </div>
  );
};

export { ControlPanel };
