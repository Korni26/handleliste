"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./ControlPanel.module.css";
import { useCreateProduct } from "@/app/Hooks/useCreateProduct";

type ControlPanelProps = {
  addProduct: (product: Product) => void;
};

const ControlPanel = ({ addProduct }: ControlPanelProps) => {
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
  };

  const submitProduct = async (e: FormEvent) => {
    e.preventDefault();

    if (!productName) {
      setError("Fyll ut produktnavn feltet.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      await useCreateProduct(productName);
      setProductName("");
    } catch (e) {
      setError("Feilet å lagre produktet.");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className={styles.control_panel}>
        <form onSubmit={submitProduct} className={styles.adding_input}>
          <input
            type="text"
            placeholder="Produktnavn"
            value={productName}
            onChange={handleInputChange}
          />
          <button className={styles.accept_button}>&#9932;</button>
        </form>
        <button className={styles.delete_button}>&#9932;</button>
      </div>
      <p className={styles.error_messages}>{error}</p>
      <p className={styles.error_messages}>{isLoading && "Laster..."}</p>
    </>
  );
};

export { ControlPanel };
