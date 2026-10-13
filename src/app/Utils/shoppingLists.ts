import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import db from "./Firestore";

export type ShoppingListDefinition = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type ShoppingProduct = Product & { listId: string };

export const DEFAULT_LIST_ID = "groceries";

export const DEFAULT_LISTS: ShoppingListDefinition[] = [
  { id: DEFAULT_LIST_ID, name: "Dagligvarer", isDefault: true },
  { id: "home", name: "Hjem", isDefault: true },
  { id: "clothing", name: "Klær", isDefault: true },
];

// Products saved before lists were introduced belong to Dagligvarer.
// This avoids any destructive migration of the existing database.
export function productListId(value: unknown): string {
  return typeof value === "string" && value.trim() !== ""
    ? value
    : DEFAULT_LIST_ID;
}

export async function getCustomShoppingLists(): Promise<ShoppingListDefinition[]> {
  const snapshot = await getDocs(collection(db, "shoppingLists"));
  return snapshot.docs
    .map((item) => ({
      id: item.id,
      name: String(item.data().name ?? ""),
      isDefault: false,
    }))
    .filter((item) => item.name.trim() !== "")
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
  return { id: created.id, name: trimmed, isDefault: false };
}

// Remove products before removing the custom list record. This is safe for
// larger lists too: a Firestore write batch supports up to 500 writes.
export async function deleteCustomShoppingList(listId: string): Promise<void> {
  if (DEFAULT_LISTS.some((item) => item.id === listId)) {
    throw new Error("Standardlister kan ikke slettes");
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
