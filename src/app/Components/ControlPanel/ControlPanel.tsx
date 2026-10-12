"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import styles from "./ControlPanel.module.css";
import { useCreateProduct } from "@/app/Hooks/useCreateProduct";

type ControlPanelProps = {
  addProduct: (newProduct: Product) => void;
};

const ControlPanel = ({ addProduct }: ControlPanelProps) => {
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
      const created = await useCreateProduct(name);
      addProduct({ id: created.id, name, isPurchased: false });
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
          <label htmlFor="product_input">Legg til et produkt:</label>
          <input
            maxLength={30}
            id="product_input"
            type="text"
            placeholder="Produktnavn"
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
