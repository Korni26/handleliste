"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import styles from "./ControlPanel.module.css";
import { useCreateProduct } from "@/app/Hooks/useCreateProduct";
import { useDeleteShoppingList } from "@/app/Hooks/useDeleteShoppingList";

type ControlPanelProps = {
  addProduct: (newProduct: Product) => void;
  deleteList: () => void;
};

const ControlPanel = ({ addProduct, deleteList }: ControlPanelProps) => {
  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteList = () => {
    useDeleteShoppingList();
    deleteList();
  };

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
      const newProduct = await useCreateProduct(productName);

      if (productName && newProduct?.id) {
        const productToAdd = {
          id: newProduct?.id,
          name: productName,
          isPurchased: false,
        };
        addProduct(productToAdd);
      }
    } catch (error) {
      setError("Feilet å lagre produktet: " + error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className={styles.control_panel}>
        <form onSubmit={submitProduct} className={styles.form}>
          <p className={styles.error_messages}>{error}</p>
          <p className={styles.error_messages}>{isLoading && "Laster..."}</p>

          <input
            maxLength={30}
            id="product_input"
            type="text"
            placeholder="Produktnavn"
            value={productName}
            onChange={handleInputChange}
          />

          <button type="submit" className={styles.accept_button}>
            &#9932;
          </button>

          {/* removed delete list button, i want to move it do a different place */}
        </form>
      </div>
    </>
  );
};

export { ControlPanel };
