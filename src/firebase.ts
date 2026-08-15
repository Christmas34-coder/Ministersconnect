import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App singleton
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
} else {
  app = getApp();
}

// Initialize Firestore with custom databaseId if configured, or default database
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Firestore Error Handler utility
export enum FirestoreErrorCode {
  PERMISSION_DENIED = 'permission-denied',
  NOT_FOUND = 'not-found',
  ALREADY_EXISTS = 'already-exists',
  UNAVAILABLE = 'unavailable',
  CANCELLED = 'cancelled',
}

export function handleFirestoreError(
  error: unknown,
  operationType: 'create' | 'read' | 'update' | 'delete' | 'list',
  collectionPath: string
): void {
  const err = error as { code?: string; message?: string };
  console.warn(`Firestore [${operationType}] failed on collection '${collectionPath}':`, err?.message || err);
}

// Collection Names
export const COLLECTIONS = {
  PROGRAMMES: 'programmes',
  REGISTRATIONS: 'registrations',
  MEMBERS: 'members',
  CHURCH_LEADERS: 'church_leaders',
  SERMONS: 'sermons',
  GALLERY: 'gallery',
  SITE_SETTINGS: 'site_settings',
  ADMIN_USERS: 'admin_users',
} as const;

export {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
};
export type { Unsubscribe, DocumentData, QuerySnapshot };
