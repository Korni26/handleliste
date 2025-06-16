import { collection, deleteDoc, getDocs } from "firebase/firestore";
import db from "../Utils/Firestore";

const useDeleteShoppingList = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  } catch (error) {
    console.error("Feilet å slette handlelisten: ", error);
  }
};

export { useDeleteShoppingList };
