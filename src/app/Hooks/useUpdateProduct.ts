import { updateDoc, doc } from "firebase/firestore";
import db from "../Utils/Firestore";

const updateProductInDatabase = (productId: string, isPurchased: boolean) =>
  updateDoc(doc(db, "products", productId), { isPurchased });

export { updateProductInDatabase };
