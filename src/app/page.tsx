"use client";

import styles from "./page.module.css";
import { ShoppingList } from "./Components/ShoppingList/ShoppingList";
import { ControlPanel } from "./Components/ControlPanel/ControlPanel";
import { useEffect, useState } from "react";
import { getDatabaseData } from "./Hooks/useGetDatabaseData";
import { useAuth } from "./Hooks/useAuth";
import { Header } from "./Components/Header/Header";
import { SignInPanel } from "./Components/SIgnInPanel/SignInPanel";
import { AccessDenied } from "./Components/AccessDenied/AccessDenied";

export default function Home() {
  const [shoppingProducts, setShoppingProducts] = useState<Product[]>([]);

  const addShoppingProduct = (newProduct: Product) => {
    setShoppingProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const deleteShoppingProduct = (productId: string) => {
    setShoppingProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const updateShoppingProduct = (productId: string, isPurchased: boolean) => {
    setShoppingProducts((prev) => prev.map((product) => product.id === productId ? { ...product, isPurchased } : product));
  };

  const deleteShoppingList = () => {
    setShoppingProducts([]);
  };

  const { user, isValidUser, loading } = useAuth();

  useEffect(() => {
    if (loading || !isValidUser) {
      setShoppingProducts([]);
      return;
    }
    let active = true;
    getDatabaseData("products").then((products) => {
      if (!active || !products) return;
      setShoppingProducts((products as Product[]).map((product) => ({
        id: product.id,
        name: product.name ?? "",
        isPurchased: !!product.isPurchased,
      })));
    });
    return () => { active = false; };
  }, [loading, isValidUser]);

  if (loading) return <div className={styles.page} role="status">Laster...</div>;
  if (user && !isValidUser) return <AccessDenied />;

  return (
    <div className={styles.page}>
      {isValidUser ? (
        <>
          <Header />
          <ShoppingList
            initialProducts={shoppingProducts}
            deleteProduct={deleteShoppingProduct}
            updateProduct={updateShoppingProduct}
            deleteList={deleteShoppingList}
          />
          <ControlPanel
            addProduct={addShoppingProduct}
          />
        </>
      ) : (
        <SignInPanel />
      )}
    </div>
  );
}
