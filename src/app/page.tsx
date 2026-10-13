"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { ShoppingList } from "./Components/ShoppingList/ShoppingList";
import { ControlPanel } from "./Components/ControlPanel/ControlPanel";
import { ListSelector } from "./Components/ListSelector/ListSelector";
import { getDatabaseData } from "./Hooks/useGetDatabaseData";
import { useAuth } from "./Hooks/useAuth";
import { Header } from "./Components/Header/Header";
import { SignInPanel } from "./Components/SIgnInPanel/SignInPanel";
import { AccessDenied } from "./Components/AccessDenied/AccessDenied";
import {
  DEFAULT_LIST_ID,
  DEFAULT_LISTS,
  createShoppingList,
  deleteCustomShoppingList,
  getCustomShoppingLists,
  productListId,
  type ShoppingListDefinition,
  type ShoppingProduct,
} from "./Utils/shoppingLists";

export default function Home() {
  const [shoppingProducts, setShoppingProducts] = useState<ShoppingProduct[]>([]);
  const [customLists, setCustomLists] = useState<ShoppingListDefinition[]>([]);
  const [activeListId, setActiveListId] = useState(DEFAULT_LIST_ID);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isChangingLists, setIsChangingLists] = useState(false);
  const [dataError, setDataError] = useState("");
  const { user, isValidUser, loading } = useAuth();

  useEffect(() => {
    if (loading || !isValidUser) {
      setShoppingProducts([]);
      setCustomLists([]);
      setActiveListId(DEFAULT_LIST_ID);
      setIsLoadingData(true);
      setDataError("");
      return;
    }

    let active = true;
    setIsLoadingData(true);
    setDataError("");

    // Lists and products are fetched independently so existing groceries
    // remain visible even if the new Firestore list rules aren't deployed yet.
    Promise.allSettled([
      getDatabaseData("products"),
      getCustomShoppingLists(),
    ]).then(([productsResult, listsResult]) => {
      if (!active) return;

      if (productsResult.status === "fulfilled" && productsResult.value) {
        const loadedProducts = productsResult.value as Array<Product & { listId?: string }>;
        setShoppingProducts(loadedProducts.map((product) => ({
          id: product.id,
          name: product.name ?? "",
          isPurchased: !!product.isPurchased,
          listId: productListId(product.listId),
        })));
      } else {
        setDataError("Kunne ikke hente produktene. Prøv å laste inn siden på nytt.");
      }

      if (listsResult.status === "fulfilled") {
        setCustomLists(listsResult.value);
      } else {
        setDataError((previous) =>
          previous || "Kunne ikke hente egne lister. Kontroller Firestore-reglene."
        );
      }

      setIsLoadingData(false);
    });

    return () => { active = false; };
  }, [loading, isValidUser]);

  const lists = [...DEFAULT_LISTS, ...customLists];
  const activeList = lists.find((list) => list.id === activeListId) ?? DEFAULT_LISTS[0];
  const activeProducts = shoppingProducts.filter((product) => product.listId === activeList.id);

  const createList = async (name: string) => {
    if (isChangingLists) return;
    setIsChangingLists(true);
    setDataError("");
    try {
      const created = await createShoppingList(name);
      setCustomLists((previous) => [...previous, created].sort((a, b) => a.name.localeCompare(b.name, "nb")));
      setActiveListId(created.id);
    } finally {
      setIsChangingLists(false);
    }
  };

  const deleteList = async () => {
    if (activeList.isDefault || isChangingLists) return;
    if (!window.confirm(`Slette «${activeList.name}» og alle produktene i listen?`)) return;

    setIsChangingLists(true);
    setDataError("");
    try {
      await deleteCustomShoppingList(activeList.id);
      setShoppingProducts((previous) => previous.filter((product) => product.listId !== activeList.id));
      setCustomLists((previous) => previous.filter((list) => list.id !== activeList.id));
      setActiveListId(DEFAULT_LIST_ID);
    } catch (error) {
      console.error("Kunne ikke slette listen:", error);
      setDataError("Kunne ikke slette listen. Last inn siden og prøv igjen.");
    } finally {
      setIsChangingLists(false);
    }
  };

  if (loading) return <div className={styles.page} role="status">Laster...</div>;
  if (user && !isValidUser) return <AccessDenied />;

  if (!isValidUser) {
    return <div className={styles.page}><SignInPanel /></div>;
  }

  return (
    <div className={styles.page}>
      <Header />
      {isLoadingData ? (
        <p role="status" className={styles.status}>Henter handlelister...</p>
      ) : (
        <>
          {dataError && <p role="alert" className={styles.error}>{dataError}</p>}
          <ListSelector
            lists={lists}
            products={shoppingProducts}
            activeListId={activeList.id}
            isBusy={isChangingLists}
            onSelect={setActiveListId}
            onCreate={createList}
            onDelete={deleteList}
          />
          <ShoppingList
            key={activeList.id}
            initialProducts={activeProducts}
            listId={activeList.id}
            listName={activeList.name}
            deleteProduct={(productId) => setShoppingProducts((previous) => previous.filter((product) => product.id !== productId))}
            updateProduct={(productId, isPurchased) => setShoppingProducts((previous) =>
              previous.map((product) => product.id === productId ? { ...product, isPurchased } : product)
            )}
            deleteList={() => setShoppingProducts((previous) => previous.filter((product) => product.listId !== activeList.id))}
          />
          <ControlPanel
            key={activeList.id}
            listId={activeList.id}
            listName={activeList.name}
            addProduct={(product) => setShoppingProducts((previous) => [...previous, product])}
          />
        </>
      )}
    </div>
  );
}
