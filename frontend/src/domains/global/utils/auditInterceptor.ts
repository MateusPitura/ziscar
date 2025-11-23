import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";

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

export function auditInterceptor(): void {
  const app = initializeApp({ projectId: "project-ziscar" });
  const db = getFirestore(app);

  if (localStorage.getItem("DISABLE_AUDIT") === "true") return;

  const connection = (navigator as Navigator)?.connection;

  const audit = {
    userAgent: navigator?.userAgent ?? null,
    referrer: document?.referrer ?? null,
    url: location?.href ?? null,
    timestamp: new Date()?.toISOString() ?? null,
    stage: process.env.NODE_ENV ?? null,
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
  };

  try {
    void addDoc(collection(db, "frontend"), audit);
  } catch (error) {
    console.error("Cannot save audit", error);
  }
}
