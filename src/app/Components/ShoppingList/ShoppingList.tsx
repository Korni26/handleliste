"use client";

import { useDeleteProduct } from "@/app/Hooks/useDeleteProduct";
import styles from "./ShoppingList.module.css";
import { useUpdateProduct } from "@/app/Hooks/useUpdateProduct";
import { ChangeEvent, useState } from "react";

type ShoppingListProps = {
  initialProducts: Product[];
  deleteProduct: (productId: string) => void;
};

const ShoppingList = ({
  initialProducts,
  deleteProduct,
}: ShoppingListProps) => {
  const [isSorted, setIsSorted] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleDelete = (productId: string) => {
    useDeleteProduct(productId);
    deleteProduct(productId);
  };

  const handleSortChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSorted(e.target.checked);
  };

  const hadnlePurchaseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const productId = e.target.id;
    const productPurchasedValue = e.target.checked;

    useUpdateProduct(productId, productPurchasedValue);

    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, isPurchased: productPurchasedValue }
        : product
    );

    setProducts(updatedProducts);
  };

  const sortedPurchasedProducts = [...products].sort((a, b) => {
    if (a.isPurchased === b.isPurchased) return 0;

    return a.isPurchased === true ? 1 : -1;
  });

  return (
    <div className={styles.shopping_list}>
      <div className={styles.list_title}>
        <h1>Handleliste</h1>
        <div className={styles.sort}>
          <input onChange={handleSortChange} id="sort" type="checkbox" />
          <label htmlFor="sort">Sorter</label>
        </div>
      </div>
      <ul>
        {(isSorted ? sortedPurchasedProducts : products).map((product) => (
          <li key={product.id}>
            <div className={styles.product_name}>
              <input
                type="checkbox"
                className={styles.checkbox}
                defaultChecked={product.isPurchased}
                id={product.id}
                onChange={(e) => hadnlePurchaseChange(e)}
              />
              {product.name}
            </div>
            <button onClick={() => handleDelete(product.id)}>&#9932;</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ShoppingList };
