import { collection, getDocs } from "firebase/firestore";
import db from "../Utils/Firestore";

const useGetDatabaseData = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export { useGetDatabaseData };
