import { updateDoc, doc } from "firebase/firestore";
import db from "../Utils/Firestore";

const useUpdateProduct = async (productId: string, isPurchased: boolean) => {
  const itemRef = doc(db, "products", productId);

  try {
    await updateDoc(itemRef, {
      isPurchased: isPurchased,
    });
  } catch (error) {
    console.error("Feilet å oppdatere produktet: ", error);
  }
};

export { useUpdateProduct };
