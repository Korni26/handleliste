import styles from "./ShoppingList.module.css";

const ShoppingList = () => {
  return (
    <div className={styles.shopping_list}>
      <div className={styles.list_title}>
        <h1>Shopping list:</h1>
      </div>
      <ul>
        <li>
          item 1 <button>&#9932;</button>
        </li>
        <li>
          item 2 <button>&#9932;</button>
        </li>
        <li>
          item 3 <button>&#9932;</button>
        </li>
        <li>
          item 4 <button>&#9932;</button>
        </li>
        <li>
          item 5 <button>&#9932;</button>
        </li>
      </ul>
    </div>
  );
};

export { ShoppingList };
