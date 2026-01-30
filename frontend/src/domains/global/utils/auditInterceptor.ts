import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { DOMAIN } from "@shared/constants";
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { nanoid } from "nanoid";
import { isProduction } from "../constants";

interface Navigator {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
    type?: string;
    downlinkMax?: number;
  };
}

export async function auditInterceptor(): Promise<void> {
  if (localStorage.getItem("DISABLE_AUDIT_ZISCAR") === "true") {
    let cookie = "DISABLE_AUDIT_ZISCAR=true; path=/;";
    if (isProduction) {
      cookie += ` domain=.${DOMAIN};`;
    }
    document.cookie = cookie;
    return;
  }

  const app = initializeApp({ projectId: "project-ziscar" });
  const db = getFirestore(app);

  let clientId = localStorage.getItem("CLIENT_ID_ZISCAR");
  if (!clientId) {
    clientId = nanoid();
    localStorage.setItem("CLIENT_ID_ZISCAR", clientId);
  }

  const connection = (navigator as Navigator)?.connection;

  const fp = await FingerprintJS.load();
  const fingerprint = await fp.get();

  const audit = {
    userAgent: navigator?.userAgent ?? null,
    referrer: document?.referrer ?? null,
    url: location?.href ?? null,
    timestamp: new Date()?.toISOString() ?? null,
    stage: import.meta.env.MODE ?? null,
    timezone: Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone,
    viewport: {
      width: window?.innerWidth ?? null,
      height: window?.innerHeight ?? null,
    },
    connection: {
      effectiveType: connection?.effectiveType ?? null,
      downlink: connection?.downlink ?? null,
      rtt: connection?.rtt ?? null,
      saveData: connection?.saveData ?? null,
      type: connection?.type ?? null,
      downlinkMax: connection?.downlinkMax ?? null,
    },
    memory: (navigator as Navigator)?.deviceMemory ?? null,
    language: navigator?.language,
    cookieEnabled: navigator?.cookieEnabled,
    fingerprint: fingerprint.visitorId,
    clientId,
  };

  try {
    void addDoc(collection(db, "frontend"), audit);
  } catch (error) {
    console.error("Cannot save audit", error);
  }
}
