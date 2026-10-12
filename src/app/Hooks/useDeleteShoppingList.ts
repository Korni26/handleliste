import { collection, getDocs, writeBatch } from "firebase/firestore";
import db from "../Utils/Firestore";

const deleteShoppingListFromDatabase = async () => {
  const snapshot = await getDocs(collection(db, "products"));
  // Firestore batches permit at most 500 write operations.
  for (let index = 0; index < snapshot.docs.length; index += 500) {
    const batch = writeBatch(db);
    snapshot.docs.slice(index, index + 500).forEach((product) => {
      batch.delete(product.ref);
    });
    await batch.commit();
  }
};

export { deleteShoppingListFromDatabase };
