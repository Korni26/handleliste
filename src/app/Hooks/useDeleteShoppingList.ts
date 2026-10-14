import { collection, getDocs, writeBatch } from "firebase/firestore";
import db from "../Utils/Firestore";
import { getShoppingLists, LEGACY_LIST_ID, productListId } from "../Utils/shoppingLists";

const deleteShoppingListFromDatabase = async (listId: string) => {
  const [lists, snapshot] = await Promise.all([
    getShoppingLists(),
    getDocs(collection(db, "products")),
  ]);
  const validIds = new Set(lists.map((list) => list.id));
  const matching = snapshot.docs.filter((product) => {
    const existingList = productListId(product.data().listId);
    return listId === LEGACY_LIST_ID
      ? !validIds.has(existingList)
      : existingList === listId;
  });

  // Firestore supports at most 500 writes in a batch.
  for (let index = 0; index < matching.length; index += 500) {
    const batch = writeBatch(db);
    matching.slice(index, index + 500).forEach((product) => {
      batch.delete(product.ref);
    });
    await batch.commit();
  }
};

export { deleteShoppingListFromDatabase };
