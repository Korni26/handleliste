"use client";

import { useDeleteProduct } from "@/app/Hooks/useDeleteProduct";
import styles from "./ShoppingList.module.css";

type ShoppingListProps = {
  products: Product[];
  deleteProduct: (productId: string) => void;
};

const ShoppingList = ({ products, deleteProduct }: ShoppingListProps) => {
  const handleDelete = (productId: string) => {
    useDeleteProduct(productId);
    deleteProduct(productId);
  };

  return (
    <div className={styles.shopping_list}>
      <div className={styles.list_title}>
        <h1>Handleliste</h1>
      </div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
            <button onClick={() => handleDelete(product.id)}>&#9932;</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ShoppingList };
