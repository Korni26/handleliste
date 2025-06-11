import styles from "./page.module.css";
import { ShoppingList } from "./Components/ShoppingList/ShoppingList";
import { ControlPanel } from "./Components/ControlPanel/ControlPanel";

export default function Home() {
  return (
    <div className={styles.page}>
      <ShoppingList />
      <ControlPanel />
    </div>
  );
}
