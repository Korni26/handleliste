"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import styles from "./ControlPanel.module.css";
import { createProduct } from "@/app/Hooks/useCreateProduct";
import type { ShoppingProduct } from "@/app/Utils/shoppingLists";

type ControlPanelProps = {
  addProduct: (newProduct: ShoppingProduct) => void;
  listId: string;
  listName: string;
};

const ControlPanel = ({ addProduct, listId, listName }: ControlPanelProps) => {
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const submitProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    const name = productName.trim();
    if (!name) {
      setError("Fyll ut produktnavn feltet.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const created = await createProduct(name, listId);
      addProduct({ id: created.id, name, isPurchased: false, listId });
      setProductName("");
    } catch (error) {
      console.error("Feilet å lagre produktet:", error);
      setError("Kunne ikke lagre produktet. Prøv igjen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={styles.control_panel}>
        <form onSubmit={submitProduct} className={styles.form}>
          <label htmlFor="product_input">Legg til i {listName}:</label>
          <input
            maxLength={30}
            id="product_input"
            type="text"
            placeholder="Hva trenger du?"
            value={productName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button type="submit" className={styles.accept_button} disabled={isLoading} aria-label="Legg til produkt">
            &#9932;
          </button>
        </form>
      </div>
      <p role="alert" className={styles.error_messages}>{error}</p>
      <p role="status" className={styles.error_messages}>{isLoading && "Lagrer..."}</p>
    </>
  );
};

export { ControlPanel };
