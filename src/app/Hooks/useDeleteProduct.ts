import { deleteDoc, doc } from "firebase/firestore";
import db from "../Utils/Firestore";

const deleteProductFromDatabase = (productId: string) =>
  deleteDoc(doc(db, "products", productId));

export { deleteProductFromDatabase };
