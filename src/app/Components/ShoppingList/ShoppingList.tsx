"use client";

import styles from "./ShoppingList.module.css";

const ShoppingList = ({ products }: ProductList) => {
  return (
    <div className={styles.shopping_list}>
      <div className={styles.list_title}>
        <h1>Shopping list</h1>
      </div>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name} <button>&#9932;</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ShoppingList };
