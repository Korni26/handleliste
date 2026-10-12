import { addDoc, collection } from "firebase/firestore";
import db from "../Utils/Firestore";

const createProduct = async (productName: string) => {
  return addDoc(collection(db, "products"), {
    name: productName,
    isPurchased: false,
  });
};

export { createProduct };
