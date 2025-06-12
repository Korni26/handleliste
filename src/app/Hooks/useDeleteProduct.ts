import { deleteDoc, doc } from "firebase/firestore";
import db from "../Utils/Firestore";

const useDeleteProduct = async (productId: string) => {
  const itemRef = doc(db, "products", productId);

  try {
    await deleteDoc(itemRef);
  } catch (error) {
    console.error("Feilet å slette produktet:", error);
  }
};

export { useDeleteProduct };
