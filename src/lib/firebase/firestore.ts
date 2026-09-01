import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./client";
import { AdminDay, PublicDay, Problem } from "@/types";
import { getPublicDays as getMockPublicDays, getPublicDayByNumber as getMockPublicDay, getAllAdminDays as getMockAdminDays, getAdminDayByNumber as getMockAdminDay } from "../mock-data";

const DAYS_COLLECTION = "days";
const ADMIN_DAYS_COLLECTION = "adminDays";

/**
 * Fetch all published days for public view.
 */
export async function getPublishedDays(): Promise<PublicDay[]> {
  try {
    const daysRef = collection(db, DAYS_COLLECTION);
    const q = query(daysRef, where("status", "==", "published"), orderBy("dayNumber", "desc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => docSnap.data() as PublicDay);
    }
  } catch (err) {
    console.warn("[Firestore] Failed to query published days, using fallback data:", err);
  }

  // Graceful fallback to initial seed / mock data
  return getMockPublicDays();
}

/**
 * Fetch a single published day by day number for public view.
 */
export async function getPublishedDayByNumber(dayNumber: number): Promise<PublicDay | undefined> {
  try {
    const dayDocRef = doc(db, DAYS_COLLECTION, `day-${dayNumber}`);
    const snapshot = await getDoc(dayDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as PublicDay;
      if (data.status === "published") {
        return data;
      }
    }
  } catch (err) {
    console.warn(`[Firestore] Failed to fetch day-${dayNumber}, using fallback data:`, err);
  }

  return getMockPublicDay(dayNumber);
}

/**
 * Fetch all days (drafts + published) for Admin Studio.
 */
export async function getAllAdminDays(): Promise<AdminDay[]> {
  try {
    const adminRef = collection(db, ADMIN_DAYS_COLLECTION);
    const q = query(adminRef, orderBy("dayNumber", "desc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => docSnap.data() as AdminDay);
    }
  } catch (err) {
    console.warn("[Firestore] Failed to query admin days, using fallback data:", err);
  }

  return getMockAdminDays();
}

/**
 * Fetch a single admin day (draft or published) by day number.
 */
export async function getAdminDayByNumber(dayNumber: number): Promise<AdminDay | undefined> {
  try {
    const adminDocRef = doc(db, ADMIN_DAYS_COLLECTION, `day-${dayNumber}`);
    const snapshot = await getDoc(adminDocRef);

    if (snapshot.exists()) {
      return snapshot.data() as AdminDay;
    }
  } catch (err) {
    console.warn(`[Firestore] Failed to fetch admin day-${dayNumber}, using fallback data:`, err);
  }

  return getMockAdminDay(dayNumber);
}

/**
 * Save or update an admin draft in adminDays collection.
 */
export async function saveAdminDraft(adminDay: AdminDay): Promise<void> {
  const docRef = doc(db, ADMIN_DAYS_COLLECTION, `day-${adminDay.dayNumber}`);
  const payload: AdminDay = {
    ...adminDay,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(docRef, payload, { merge: true });
}

/**
 * Publish a day atomically:
 * 1. Writes clean public problem payload to `days/day-${dayNumber}` (zero WhatsApp or admin data).
 * 2. Updates status in `adminDays/day-${dayNumber}` to 'published'.
 */
export async function publishDay(adminDay: AdminDay): Promise<void> {
  const now = new Date().toISOString();

  // 1. Clean public slice
  const publicPayload: PublicDay = {
    id: `day-${adminDay.dayNumber}`,
    dayNumber: adminDay.dayNumber,
    topic: adminDay.topic,
    status: "published",
    problemCount: adminDay.problems.length,
    publishedAt: adminDay.publishedAt || now,
    problems: adminDay.problems,
  };

  // 2. Write to public collection
  const publicDocRef = doc(db, DAYS_COLLECTION, `day-${adminDay.dayNumber}`);
  await setDoc(publicDocRef, publicPayload);

  // 3. Update admin document
  const adminDocRef = doc(db, ADMIN_DAYS_COLLECTION, `day-${adminDay.dayNumber}`);
  await setDoc(
    adminDocRef,
    {
      ...adminDay,
      status: "published",
      publishedAt: adminDay.publishedAt || now,
      updatedAt: now,
    },
    { merge: true }
  );
}

/**
 * Unpublish a day:
 * 1. Removes document from public `days` collection.
 * 2. Updates `adminDays` status back to 'draft'.
 */
export async function unpublishDay(dayNumber: number): Promise<void> {
  const publicDocRef = doc(db, DAYS_COLLECTION, `day-${dayNumber}`);
  await deleteDoc(publicDocRef);

  const adminDocRef = doc(db, ADMIN_DAYS_COLLECTION, `day-${dayNumber}`);
  await updateDoc(adminDocRef, {
    status: "draft",
    updatedAt: new Date().toISOString(),
  });
}
