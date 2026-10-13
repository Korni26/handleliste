import { collection, getDocs, writeBatch } from "firebase/firestore";
import db from "../Utils/Firestore";
import { productListId } from "../Utils/shoppingLists";

const deleteShoppingListFromDatabase = async (listId: string) => {
  const snapshot = await getDocs(collection(db, "products"));
  const matching = snapshot.docs.filter(
    (product) => productListId(product.data().listId) === listId
  );

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
