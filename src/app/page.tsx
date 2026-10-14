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
  LEGACY_LIST_ID,
  createShoppingList,
  renameShoppingList,
  deleteCustomShoppingList,
  getShoppingLists,
  moveLegacyProductsToList,
  productListId,
  type ShoppingListDefinition,
  type ShoppingProduct,
} from "./Utils/shoppingLists";

const LEGACY_LIST_NAME = "Tidligere produkter";

export default function Home() {
  const [shoppingProducts, setShoppingProducts] = useState<ShoppingProduct[]>([]);
  const [savedLists, setSavedLists] = useState<ShoppingListDefinition[]>([]);
  const [activeListId, setActiveListId] = useState("");
  const [moveToListId, setMoveToListId] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isChangingLists, setIsChangingLists] = useState(false);
  const [dataError, setDataError] = useState("");
  const [listLoadFailed, setListLoadFailed] = useState(false);
  const { user, isValidUser, loading } = useAuth();

  useEffect(() => {
    if (loading || !isValidUser) {
      setShoppingProducts([]);
      setSavedLists([]);
      setActiveListId("");
      setIsLoadingData(true);
      setListLoadFailed(false);
      setDataError("");
      return;
    }

    let active = true;
    setIsLoadingData(true);
    setListLoadFailed(false);
    setDataError("");

    Promise.allSettled([
      getDatabaseData("products"),
      getShoppingLists(),
    ]).then(([productsResult, listsResult]) => {
      if (!active) return;

      // Do not offer destructive list operations until we know the actual list IDs.
      // Otherwise old products might look unassigned when list rules are missing.
      if (listsResult.status !== "fulfilled") {
        setListLoadFailed(true);
        setDataError("Kunne ikke hente listene fra Firestore. Sjekk tilgangsreglene og last inn siden på nytt.");
        setIsLoadingData(false);
        return;
      }

      const loadedLists = listsResult.value;
      setSavedLists(loadedLists);
      const validIds = new Set(loadedLists.map((list) => list.id));

      if (productsResult.status === "fulfilled" && productsResult.value) {
        const loadedProducts = productsResult.value as Array<Product & { listId?: string }>;
        setShoppingProducts(loadedProducts.map((product) => {
          const oldListId = productListId(product.listId);
          return {
            id: product.id,
            name: product.name ?? "",
            isPurchased: !!product.isPurchased,
            listId: validIds.has(oldListId) ? oldListId : LEGACY_LIST_ID,
          };
        }));
      } else {
        setListLoadFailed(true);
        setDataError("Kunne ikke hente produktene. Last inn siden på nytt og prøv igjen.");
      }

      setIsLoadingData(false);
    });

    return () => { active = false; };
  }, [loading, isValidUser]);

  const legacyProductsExist = shoppingProducts.some((product) => product.listId === LEGACY_LIST_ID);
  const lists: ShoppingListDefinition[] = [
    ...(legacyProductsExist ? [{ id: LEGACY_LIST_ID, name: LEGACY_LIST_NAME }] : []),
    ...savedLists,
  ];
  const activeList = lists.find((list) => list.id === activeListId) ?? lists[0];
  const activeProducts = activeList
    ? shoppingProducts.filter((product) => product.listId === activeList.id)
    : [];

  const createList = async (name: string) => {
    if (isChangingLists) return;
    setIsChangingLists(true);
    setDataError("");
    try {
      const created = await createShoppingList(name);
      setSavedLists((previous) =>
        [...previous, created].sort((a, b) => a.name.localeCompare(b.name, "nb"))
      );
      setActiveListId(created.id);
    } catch (error) {
      console.error("Kunne ikke opprette listen:", error);
      throw error;
    } finally {
      setIsChangingLists(false);
    }
  };

  const renameList = async (name: string) => {
    if (!activeList || activeList.id === LEGACY_LIST_ID || isChangingLists) return;
    setIsChangingLists(true);
    setDataError("");
    try {
      await renameShoppingList(activeList.id, name);
      setSavedLists((previous) =>
        previous.map((list) => list.id === activeList.id ? { ...list, name } : list)
          .sort((a, b) => a.name.localeCompare(b.name, "nb"))
      );
    } catch (error) {
      console.error("Kunne ikke gi listen nytt navn:", error);
      throw error;
    } finally {
      setIsChangingLists(false);
    }
  };

  const deleteList = async () => {
    if (!activeList || activeList.id === LEGACY_LIST_ID || isChangingLists) return;
    if (!window.confirm(`Slette «${activeList.name}» og alle produktene i listen?`)) return;

    setIsChangingLists(true);
    setDataError("");
    try {
      await deleteCustomShoppingList(activeList.id);
      setShoppingProducts((previous) => previous.filter((product) => product.listId !== activeList.id));
      setSavedLists((previous) => previous.filter((list) => list.id !== activeList.id));
      setActiveListId("");
    } catch (error) {
      console.error("Kunne ikke slette listen:", error);
      setDataError("Kunne ikke slette listen. Last inn siden og prøv igjen.");
    } finally {
      setIsChangingLists(false);
    }
  };

  const moveLegacy = async () => {
    if (!savedLists.some((list) => list.id === moveToListId) || isChangingLists) return;
    setIsChangingLists(true);
    setDataError("");
    try {
      await moveLegacyProductsToList(moveToListId);
      setShoppingProducts((previous) => previous.map((product) =>
        product.listId === LEGACY_LIST_ID ? { ...product, listId: moveToListId } : product
      ));
      setActiveListId(moveToListId);
    } catch (error) {
      console.error("Kunne ikke flytte produktene:", error);
      setDataError("Kunne ikke flytte produktene. Oppdater siden og prøv igjen.");
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
          {!listLoadFailed && (
            <>
              <ListSelector
                lists={lists}
                products={shoppingProducts}
                activeListId={activeList?.id ?? ""}
                isBusy={isChangingLists}
                onSelect={setActiveListId}
                onCreate={createList}
                onRename={renameList}
                onDelete={deleteList}
              />
              {activeList ? (
                <>
                  <ShoppingList
                    key={`shopping-${activeList.id}`}
                    initialProducts={activeProducts}
                    listId={activeList.id}
                    listName={activeList.name}
                    deleteProduct={(productId) => setShoppingProducts((previous) => previous.filter((product) => product.id !== productId))}
                    updateProduct={(productId, isPurchased) => setShoppingProducts((previous) =>
                      previous.map((product) => product.id === productId ? { ...product, isPurchased } : product)
                    )}
                    deleteList={() => setShoppingProducts((previous) => previous.filter((product) => product.listId !== activeList.id))}
                  />
                  {activeList.id === LEGACY_LIST_ID ? (
                    <section className={styles.movePanel}>
                      <p>Disse produktene ble lagt til før du kunne opprette egne lister. Velg hvor du vil flytte dem.</p>
                      <div className={styles.moveRow}>
                        <select
                          aria-label="Flytt produkter til liste"
                          value={savedLists.some((list) => list.id === moveToListId) ? moveToListId : ""}
                          disabled={isChangingLists || savedLists.length === 0}
                          onChange={(event) => setMoveToListId(event.target.value)}
                        >
                          <option value="">Velg liste</option>
                          {savedLists.map((list) =>
                            <option key={list.id} value={list.id}>{list.name}</option>
                          )}
                        </select>
                        <button
                          type="button"
                          disabled={isChangingLists || !savedLists.some((list) => list.id === moveToListId)}
                          onClick={() => { void moveLegacy(); }}
                        >{isChangingLists ? "Flytter..." : "Flytt alle"}</button>
                      </div>
                      {savedLists.length === 0 && <p>Opprett først en liste med «+ Ny liste».</p>}
                    </section>
                  ) : (
                    <ControlPanel
                      key={`control-${activeList.id}`}
                      listId={activeList.id}
                      listName={activeList.name}
                      addProduct={(product) => setShoppingProducts((previous) => [...previous, product])}
                    />
                  )}
                </>
              ) : (
                <p className={styles.status}>Du har ingen handlelister ennå. Velg «+ Ny liste» for å lage din første.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
