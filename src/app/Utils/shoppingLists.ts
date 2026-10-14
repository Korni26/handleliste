import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import db from "./Firestore";

export type ShoppingListDefinition = {
  id: string;
  name: string;
};

export type ShoppingProduct = Product & { listId: string };

// This ID is not a predefined shopping category. It is used only to display
// products saved before list support was added, until the user moves them.
export const LEGACY_LIST_ID = "__legacy__";

export function productListId(value: unknown): string {
  return typeof value === "string" && value.trim() !== ""
    ? value
    : LEGACY_LIST_ID;
}

export async function getShoppingLists(): Promise<ShoppingListDefinition[]> {
  const snapshot = await getDocs(collection(db, "shoppingLists"));
  return snapshot.docs
    .map((item) => ({
      id: item.id,
      name: String(item.data().name ?? "").trim(),
    }))
    .filter((item) => item.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name, "nb"));
}

export async function createShoppingList(name: string): Promise<ShoppingListDefinition> {
  const trimmed = name.trim();
  if (!trimmed || trimmed.length > 32) {
    throw new Error("Ugyldig listenavn");
  }

  const created = await addDoc(collection(db, "shoppingLists"), {
    name: trimmed,
    createdAt: serverTimestamp(),
  });
  return { id: created.id, name: trimmed };
}

export async function renameShoppingList(listId: string, name: string): Promise<void> {
  const trimmed = name.trim();
  if (listId === LEGACY_LIST_ID || !trimmed || trimmed.length > 32) {
    throw new Error("Ugyldig listenavn");
  }
  await updateDoc(doc(db, "shoppingLists", listId), { name: trimmed });
}

// Delete only products associated with the selected list, then delete its record.
// Uses 500-write batches to support longer lists.
export async function deleteCustomShoppingList(listId: string): Promise<void> {
  if (listId === LEGACY_LIST_ID) {
    throw new Error("Kan ikke slette samlingen med tidligere produkter");
  }

  const products = await getDocs(collection(db, "products"));
  const matching = products.docs.filter(
    (item) => productListId(item.data().listId) === listId
  );

  for (let start = 0; start < matching.length; start += 500) {
    const batch = writeBatch(db);
    for (const product of matching.slice(start, start + 500)) {
      batch.delete(product.ref);
    }
    await batch.commit();
  }

  await deleteDoc(doc(db, "shoppingLists", listId));
}

// Move products with missing or retired list IDs into a real list, preserving checkmarks.
export async function moveLegacyProductsToList(listId: string): Promise<void> {
  if (!listId || listId === LEGACY_LIST_ID) {
    throw new Error("Velg en handleliste");
  }

  const [lists, snapshot] = await Promise.all([
    getShoppingLists(),
    getDocs(collection(db, "products")),
  ]);
  const validIds = new Set(lists.map((list) => list.id));
  const legacyProducts = snapshot.docs.filter(
    (item) => !validIds.has(productListId(item.data().listId))
  );

  for (let start = 0; start < legacyProducts.length; start += 500) {
    const batch = writeBatch(db);
    for (const product of legacyProducts.slice(start, start + 500)) {
      batch.update(product.ref, { listId });
    }
    await batch.commit();
  }
}
