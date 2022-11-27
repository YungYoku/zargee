import axios from "axios";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/main";
import type { Analytics } from "@/api/analytics";
import type { requestTypes } from "@/api/requestTypes";

const getIp = async () => {
  return await axios
    .get("https://api.db-ip.com/v2/free/self")
    .then((response) => {
      return response.data.ipAddress;
    });
};

export const sendAnalyticsRequest = async (
  url: typeof requestTypes[number]
) => {
  await getIp().then(async (ip) => {
    const request: Analytics = {
      type: url,
      ip,
      date: new Date(),
    };

    await updateDoc(doc(db, "requests", "requests"), {
      requests: arrayUnion(request),
    });
  });
};

export const getAnalytics = async () => {
  const docRef = doc(db, "requests", "requests");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data()["requests"] as Analytics[];
  }
  return [] as Analytics[];
};
