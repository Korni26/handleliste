"use client";

import styles from "./page.module.css";
import { ShoppingList } from "./Components/ShoppingList/ShoppingList";
import { ControlPanel } from "./Components/ControlPanel/ControlPanel";
import { useEffect, useState } from "react";
import { useGetData } from "./Hooks/useGetData";

export default function Home() {
  const [shoppingProducts, setShoppingProducts] = useState<Product[]>([]);

  const addShoppingProduct = (newProduct: Product) => {
    setShoppingProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const fetchdata = async () => {
    useGetData("products").then((products) => setShoppingProducts(products));
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className={styles.page}>
      <ShoppingList products={shoppingProducts} />
      <ControlPanel  />
    </div>
  );
}
