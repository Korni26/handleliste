import { updateDoc, doc } from "firebase/firestore";
import db from "../Utils/Firestore";

const useUpdateProduct = (productId: string, isPurchased: boolean) =>
  updateDoc(doc(db, "products", productId), { isPurchased });

export { useUpdateProduct };
