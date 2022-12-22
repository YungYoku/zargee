import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/main";

export const reportError = async (error: unknown) => {
  await updateDoc(doc(db, "errors", "errors"), {
    list: arrayUnion(error),
  });
};
