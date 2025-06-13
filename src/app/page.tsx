"use client";

import styles from "./page.module.css";
import { ShoppingList } from "./Components/ShoppingList/ShoppingList";
import { ControlPanel } from "./Components/ControlPanel/ControlPanel";
import { useEffect, useState } from "react";
import { useGetData } from "./Hooks/useGetData";
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

  const fetchdata = async () => {
    useGetData("products").then((products) => {
      const validProducts = products.map((product: any) => ({
        id: product.id,
        name: product.name ?? "",
      }));
      setShoppingProducts(validProducts);
    });
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const { user, isValidUser } = useAuth();

  if (user && !isValidUser) return <AccessDenied />;

  return (
    <div className={styles.page}>
      {isValidUser ? (
        <>
          <Header />
          <ShoppingList
            products={shoppingProducts}
            deleteProduct={deleteShoppingProduct}
          />
          <ControlPanel addProduct={addShoppingProduct} />
        </>
      ) : (
        <SignInPanel />
      )}
    </div>
  );
}
