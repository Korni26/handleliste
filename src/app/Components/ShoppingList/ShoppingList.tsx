"use client";

import { deleteProductFromDatabase } from "@/app/Hooks/useDeleteProduct";
import { updateProductInDatabase } from "@/app/Hooks/useUpdateProduct";
import { deleteShoppingListFromDatabase } from "@/app/Hooks/useDeleteShoppingList";
import styles from "./ShoppingList.module.css";
import { useEffect, useState } from "react";
import { Product } from "../Product/Product";

type ShoppingListProps = {
  initialProducts: Product[];
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, isPurchased: boolean) => void;
  deleteList: () => void;
};

const ShoppingList = ({ initialProducts, deleteProduct, updateProduct, deleteList }: ShoppingListProps) => {
  const [isSorted, setIsSorted] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setProducts(initialProducts), [initialProducts]);

  const handleDeleteList = async () => {
    if (isClearing || busyIds.length || products.length === 0) return;
    if (!window.confirm("Vil du slette hele handlelisten?")) return;
    setIsClearing(true);
    setError("");
    try {
      await deleteShoppingListFromDatabase();
      deleteList();
    } catch (err) {
      console.error("Kunne ikke slette handlelisten:", err);
      setError("Kunne ikke slette hele listen. Last inn siden på nytt og prøv igjen.");
    } finally {
      setIsClearing(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (isClearing || busyIds.includes(productId)) return;
    setBusyIds((prev) => [...prev, productId]);
    setError("");
    try {
      await deleteProductFromDatabase(productId);
      deleteProduct(productId);
    } catch (err) {
      console.error("Kunne ikke slette produktet:", err);
      setError("Kunne ikke slette produktet. Prøv igjen.");
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handlePurchaseChange = async (productId: string, purchased: boolean) => {
    if (isClearing || busyIds.includes(productId)) return;
    setBusyIds((prev) => [...prev, productId]);
    setError("");
    try {
      await updateProductInDatabase(productId, purchased);
      updateProduct(productId, purchased);
    } catch (err) {
      console.error("Kunne ikke oppdatere produktet:", err);
      setError("Kunne ikke oppdatere produktet. Prøv igjen.");
    } finally {
      setBusyIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const visibleProducts = isSorted
    ? [...products].sort((a, b) =>
        Number(a.isPurchased) - Number(b.isPurchased) ||
        a.name.localeCompare(b.name, "nb", { sensitivity: "base" })
      )
    : products;

  const allPurchased = products.length > 0 && products.every((product) => product.isPurchased);

  return (
    <div className={`${styles.shopping_list} ${allPurchased ? styles.all_products_purchased : ""}`}>
      <div className={styles.list_title}>
        <h1>Handleliste</h1>
        <p className={styles.count}>{products.filter((product) => !product.isPurchased).length} igjen å handle</p>
        <div className={styles.sort}>
          <input
            id="sort"
            type="checkbox"
            checked={isSorted}
            onChange={(event) => setIsSorted(event.target.checked)}
          />
          <label htmlFor="sort">Sorter A–Å (kjøpte sist)</label>
        </div>
        <button
          type="button"
          onClick={handleDeleteList}
          className={styles.delete_button}
          disabled={isClearing || busyIds.length > 0 || products.length === 0}
        >
          {isClearing ? "Sletter..." : "Slett"}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
      <ul>
        {visibleProducts.map((product) => (
          <Product
            key={product.id}
            product={product}
            disabled={isClearing || busyIds.includes(product.id)}
            handlePurchaseChange={handlePurchaseChange}
            handleDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export { ShoppingList };
