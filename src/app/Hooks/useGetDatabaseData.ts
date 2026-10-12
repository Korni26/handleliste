import { collection, getDocs } from "firebase/firestore";
import db from "../Utils/Firestore";

const getDatabaseData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Feilet å oppdatere produktet: ", error);
  }
};

export { getDatabaseData };
