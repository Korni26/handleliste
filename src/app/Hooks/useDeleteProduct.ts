import { deleteDoc, doc } from "firebase/firestore";
import db from "../Utils/Firestore";

const useDeleteProduct = (productId: string) =>
  deleteDoc(doc(db, "products", productId));

export { useDeleteProduct };
