import { addDoc, collection } from "firebase/firestore";
import db from "../Utils/Firestore";

const useCreateProduct = async (productName: string) => {
  try {
    const res = await addDoc(collection(db, "products"), {
      name: productName,
    });
    return res;
  } catch (e) {
    console.error("Error:", e);
  }
};

export { useCreateProduct };
