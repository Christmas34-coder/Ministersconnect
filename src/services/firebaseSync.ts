import {
  db,
  COLLECTIONS,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  handleFirestoreError,
  Unsubscribe,
} from '../firebase';
import {
  Programme,
  Registration,
  MemberUser,
  ChurchLeader,
  SermonMedia,
  GalleryItem,
  SiteSettings,
  AdminUser,
} from '../types';
import {
  INITIAL_PROGRAMMES,
  INITIAL_REGISTRATIONS,
  INITIAL_MEMBERS,
  INITIAL_CHURCH_LEADERS,
  INITIAL_SERMONS,
  INITIAL_GALLERY,
  DEFAULT_SITE_SETTINGS,
  INITIAL_ADMINS,
} from '../data/seedData';
import {
  saveProgrammes,
  saveRegistrations,
  saveMembers,
  saveChurchLeaders,
  saveSermons,
  saveGallery,
  saveSiteSettings,
  saveAdminUsers,
} from '../utils/storage';

type SyncListenerCallback = () => void;
const listeners: Set<SyncListenerCallback> = new Set();

export function subscribeToDataChanges(callback: SyncListenerCallback): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notifyDataChanged() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error('Error in sync listener callback', e);
    }
  });
}

let isInitialized = false;
const unsubscribers: Unsubscribe[] = [];

/**
 * Initialize real-time listeners for all collections and seed initial data if collections are empty.
 */
export function initFirebaseSync(): () => void {
  if (isInitialized) {
    return () => {};
  }
  isInitialized = true;

  try {
    // 1. PROGRAMMES SYNC
    const progCol = collection(db, COLLECTIONS.PROGRAMMES);
    const unsubProg = onSnapshot(
      progCol,
      (snapshot) => {
        if (snapshot.empty) {
          // Seed initial programmes to Firestore
          INITIAL_PROGRAMMES.forEach((p) => {
            setDoc(doc(db, COLLECTIONS.PROGRAMMES, p.id), p).catch((err) =>
              handleFirestoreError(err, 'create', COLLECTIONS.PROGRAMMES)
            );
          });
        } else {
          const progs: Programme[] = [];
          snapshot.forEach((docSnap) => {
            progs.push(docSnap.data() as Programme);
          });
          saveProgrammes(progs);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.PROGRAMMES)
    );
    unsubscribers.push(unsubProg);

    // 2. REGISTRATIONS SYNC
    const regCol = collection(db, COLLECTIONS.REGISTRATIONS);
    const unsubReg = onSnapshot(
      regCol,
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_REGISTRATIONS.forEach((r) => {
            setDoc(doc(db, COLLECTIONS.REGISTRATIONS, r.id), r).catch((err) =>
              handleFirestoreError(err, 'create', COLLECTIONS.REGISTRATIONS)
            );
          });
        } else {
          const regs: Registration[] = [];
          snapshot.forEach((docSnap) => {
            regs.push(docSnap.data() as Registration);
          });
          // Sort newest registrations first
          regs.sort(
            (a, b) =>
              new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
          );
          saveRegistrations(regs);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.REGISTRATIONS)
    );
    unsubscribers.push(unsubReg);

    // 3. MEMBERS SYNC
    const memCol = collection(db, COLLECTIONS.MEMBERS);
    const unsubMem = onSnapshot(
      memCol,
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_MEMBERS.forEach((m) => {
            setDoc(doc(db, COLLECTIONS.MEMBERS, m.id), m).catch((err) =>
              handleFirestoreError(err, 'create', COLLECTIONS.MEMBERS)
            );
          });
        } else {
          const members: MemberUser[] = [];
          snapshot.forEach((docSnap) => {
            members.push(docSnap.data() as MemberUser);
          });
          saveMembers(members);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.MEMBERS)
    );
    unsubscribers.push(unsubMem);

    // 4. CHURCH LEADERS DIRECTORY SYNC
    const leaderCol = collection(db, COLLECTIONS.CHURCH_LEADERS);
    const unsubLeaders = onSnapshot(
      leaderCol,
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_CHURCH_LEADERS.forEach((l) => {
            setDoc(doc(db, COLLECTIONS.CHURCH_LEADERS, l.id), l).catch((err) =>
              handleFirestoreError(err, 'create', COLLECTIONS.CHURCH_LEADERS)
            );
          });
        } else {
          const leaders: ChurchLeader[] = [];
          snapshot.forEach((docSnap) => {
            leaders.push(docSnap.data() as ChurchLeader);
          });
          saveChurchLeaders(leaders);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.CHURCH_LEADERS)
    );
    unsubscribers.push(unsubLeaders);

    // 5. SERMONS SYNC
    const sermonCol = collection(db, COLLECTIONS.SERMONS);
    const unsubSermons = onSnapshot(
      sermonCol,
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_SERMONS.forEach((s) => {
            setDoc(doc(db, COLLECTIONS.SERMONS, s.id), s).catch((err) =>
              handleFirestoreError(err, 'create', COLLECTIONS.SERMONS)
            );
          });
        } else {
          const sermons: SermonMedia[] = [];
          snapshot.forEach((docSnap) => {
            sermons.push(docSnap.data() as SermonMedia);
          });
          saveSermons(sermons);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.SERMONS)
    );
    unsubscribers.push(unsubSermons);

    // 6. GALLERY SYNC
    const galleryCol = collection(db, COLLECTIONS.GALLERY);
    const unsubGallery = onSnapshot(
      galleryCol,
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_GALLERY.forEach((g) => {
            setDoc(doc(db, COLLECTIONS.GALLERY, g.id), g).catch((err) =>
              handleFirestoreError(err, 'create', COLLECTIONS.GALLERY)
            );
          });
        } else {
          const items: GalleryItem[] = [];
          snapshot.forEach((docSnap) => {
            items.push(docSnap.data() as GalleryItem);
          });
          saveGallery(items);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.GALLERY)
    );
    unsubscribers.push(unsubGallery);

    // 7. SITE SETTINGS SYNC
    const settingsCol = collection(db, COLLECTIONS.SITE_SETTINGS);
    const unsubSettings = onSnapshot(
      settingsCol,
      (snapshot) => {
        if (snapshot.empty) {
          setDoc(doc(db, COLLECTIONS.SITE_SETTINGS, 'global_config'), DEFAULT_SITE_SETTINGS).catch(
            (err) => handleFirestoreError(err, 'create', COLLECTIONS.SITE_SETTINGS)
          );
        } else {
          let settings = DEFAULT_SITE_SETTINGS;
          snapshot.forEach((docSnap) => {
            settings = { ...DEFAULT_SITE_SETTINGS, ...(docSnap.data() as SiteSettings) };
          });
          saveSiteSettings(settings);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.SITE_SETTINGS)
    );
    unsubscribers.push(unsubSettings);

    // 8. ADMIN USERS SYNC
    const adminCol = collection(db, COLLECTIONS.ADMIN_USERS);
    const unsubAdmins = onSnapshot(
      adminCol,
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_ADMINS.forEach((a) => {
            setDoc(doc(db, COLLECTIONS.ADMIN_USERS, a.id), a).catch((err) =>
              handleFirestoreError(err, 'create', COLLECTIONS.ADMIN_USERS)
            );
          });
        } else {
          const admins: AdminUser[] = [];
          snapshot.forEach((docSnap) => {
            admins.push(docSnap.data() as AdminUser);
          });
          saveAdminUsers(admins);
          notifyDataChanged();
        }
      },
      (err) => handleFirestoreError(err, 'list', COLLECTIONS.ADMIN_USERS)
    );
    unsubscribers.push(unsubAdmins);
  } catch (err) {
    console.error('Failed to initialize Firebase Sync:', err);
  }

  return () => {
    unsubscribers.forEach((u) => u());
  };
}

// ASYNC CLOUD ACTIONS (Writes to Firestore immediately)

export async function syncAddProgrammeToCloud(prog: Programme): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.PROGRAMMES, prog.id), prog);
  } catch (err) {
    handleFirestoreError(err, 'create', COLLECTIONS.PROGRAMMES);
  }
}

export async function syncUpdateProgrammeToCloud(id: string, updates: Partial<Programme>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.PROGRAMMES, id), updates);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.PROGRAMMES);
  }
}

export async function syncDeleteProgrammeFromCloud(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.PROGRAMMES, id));
  } catch (err) {
    handleFirestoreError(err, 'delete', COLLECTIONS.PROGRAMMES);
  }
}

export async function syncAddRegistrationToCloud(reg: Registration): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.REGISTRATIONS, reg.id), reg);
  } catch (err) {
    handleFirestoreError(err, 'create', COLLECTIONS.REGISTRATIONS);
  }
}

export async function syncUpdateRegistrationToCloud(id: string, updates: Partial<Registration>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.REGISTRATIONS, id), updates);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.REGISTRATIONS);
  }
}

export async function syncDeleteRegistrationFromCloud(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.REGISTRATIONS, id));
  } catch (err) {
    handleFirestoreError(err, 'delete', COLLECTIONS.REGISTRATIONS);
  }
}

export async function syncAddMemberToCloud(member: MemberUser): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.MEMBERS, member.id), member);
  } catch (err) {
    handleFirestoreError(err, 'create', COLLECTIONS.MEMBERS);
  }
}

export async function syncUpdateMemberToCloud(id: string, updates: Partial<MemberUser>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.MEMBERS, id), updates);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.MEMBERS);
  }
}

export async function syncDeleteMemberFromCloud(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.MEMBERS, id));
  } catch (err) {
    handleFirestoreError(err, 'delete', COLLECTIONS.MEMBERS);
  }
}

export async function syncAddChurchLeaderToCloud(leader: ChurchLeader): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.CHURCH_LEADERS, leader.id), leader);
  } catch (err) {
    handleFirestoreError(err, 'create', COLLECTIONS.CHURCH_LEADERS);
  }
}

export async function syncUpdateChurchLeaderToCloud(id: string, updates: Partial<ChurchLeader>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.CHURCH_LEADERS, id), updates);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.CHURCH_LEADERS);
  }
}

export async function syncDeleteChurchLeaderFromCloud(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CHURCH_LEADERS, id));
  } catch (err) {
    handleFirestoreError(err, 'delete', COLLECTIONS.CHURCH_LEADERS);
  }
}

export async function syncAddSermonToCloud(sermon: SermonMedia): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.SERMONS, sermon.id), sermon);
  } catch (err) {
    handleFirestoreError(err, 'create', COLLECTIONS.SERMONS);
  }
}

export async function syncUpdateSermonToCloud(id: string, updates: Partial<SermonMedia>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.SERMONS, id), updates);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.SERMONS);
  }
}

export async function syncDeleteSermonFromCloud(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SERMONS, id));
  } catch (err) {
    handleFirestoreError(err, 'delete', COLLECTIONS.SERMONS);
  }
}

export async function syncAddGalleryItemToCloud(item: GalleryItem): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.GALLERY, item.id), item);
  } catch (err) {
    handleFirestoreError(err, 'create', COLLECTIONS.GALLERY);
  }
}

export async function syncUpdateGalleryItemToCloud(id: string, updates: Partial<GalleryItem>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.GALLERY, id), updates);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.GALLERY);
  }
}

export async function syncDeleteGalleryItemFromCloud(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
  } catch (err) {
    handleFirestoreError(err, 'delete', COLLECTIONS.GALLERY);
  }
}

export async function syncUpdateSiteSettingsToCloud(settings: SiteSettings): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.SITE_SETTINGS, 'global_config'), settings);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.SITE_SETTINGS);
  }
}

export async function syncAddAdminUserToCloud(admin: AdminUser): Promise<void> {
  try {
    await setDoc(doc(db, COLLECTIONS.ADMIN_USERS, admin.id), admin);
  } catch (err) {
    handleFirestoreError(err, 'create', COLLECTIONS.ADMIN_USERS);
  }
}

export async function syncUpdateAdminUserToCloud(id: string, updates: Partial<AdminUser>): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTIONS.ADMIN_USERS, id), updates);
  } catch (err) {
    handleFirestoreError(err, 'update', COLLECTIONS.ADMIN_USERS);
  }
}

export async function syncDeleteAdminUserFromCloud(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTIONS.ADMIN_USERS, id));
  } catch (err) {
    handleFirestoreError(err, 'delete', COLLECTIONS.ADMIN_USERS);
  }
}
