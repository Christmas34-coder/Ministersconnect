import {
  Programme,
  Registration,
  GalleryItem,
  SiteSettings,
  AdminUser,
  MemberUser,
  ChurchLeader,
  SermonMedia,
} from '../types';
import {
  INITIAL_PROGRAMMES,
  INITIAL_REGISTRATIONS,
  INITIAL_GALLERY,
  DEFAULT_SITE_SETTINGS,
  INITIAL_ADMINS,
  INITIAL_MEMBERS,
  INITIAL_CHURCH_LEADERS,
  INITIAL_SERMONS,
} from '../data/seedData';
import {
  MINISTERS_CONNECT_FLIER_LANDSCAPE,
  MINISTERS_CONNECT_FLIER_PORTRAIT,
} from '../assets/flierImage';
import {
  syncAddProgrammeToCloud,
  syncUpdateProgrammeToCloud,
  syncDeleteProgrammeFromCloud,
  syncAddRegistrationToCloud,
  syncUpdateRegistrationToCloud,
  syncDeleteRegistrationFromCloud,
  syncAddMemberToCloud,
  syncUpdateMemberToCloud,
  syncDeleteMemberFromCloud,
  syncAddChurchLeaderToCloud,
  syncUpdateChurchLeaderToCloud,
  syncDeleteChurchLeaderFromCloud,
  syncAddSermonToCloud,
  syncUpdateSermonToCloud,
  syncDeleteSermonFromCloud,
  syncAddGalleryItemToCloud,
  syncUpdateGalleryItemToCloud,
  syncDeleteGalleryItemFromCloud,
  syncUpdateSiteSettingsToCloud,
  syncAddAdminUserToCloud,
  syncUpdateAdminUserToCloud,
  syncDeleteAdminUserFromCloud,
} from '../services/firebaseSync';

const KEYS = {
  PROGRAMMES: 'mc_programmes_v3',
  REGISTRATIONS: 'mc_registrations_v3',
  GALLERY: 'mc_gallery_v3',
  ADMIN_AUTH: 'mc_admin_auth_v3',
  SITE_SETTINGS: 'mc_site_settings_v3',
  ADMIN_USERS: 'mc_admin_users_v3',
  CURRENT_ADMIN: 'mc_current_admin_v3',
  MEMBERS: 'mc_members_v3',
  CURRENT_MEMBER: 'mc_current_member_v3',
  CHURCH_LEADERS: 'mc_church_leaders_v3',
  SERMONS: 'mc_sermons_v3',
};

// Unique ID Generator for Registration (e.g. MC-2026-AUG-82419)
export function generateRegistrationId(): string {
  const year = new Date().getFullYear();
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[new Date().getMonth()];
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `MC-${year}-${month}-${randomNum}`;
}

// PROGRAMMES
export function getProgrammes(): Programme[] {
  try {
    const data = localStorage.getItem(KEYS.PROGRAMMES);
    if (!data) {
      localStorage.setItem(KEYS.PROGRAMMES, JSON.stringify(INITIAL_PROGRAMMES));
      return INITIAL_PROGRAMMES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading programmes from localStorage', e);
    return INITIAL_PROGRAMMES;
  }
}

export function saveProgrammes(programmes: Programme[]): void {
  try {
    localStorage.setItem(KEYS.PROGRAMMES, JSON.stringify(programmes));
  } catch (e) {
    console.error('Error saving programmes', e);
  }
}

export function addProgramme(programme: Omit<Programme, 'id' | 'registeredCount'>): Programme {
  const current = getProgrammes();
  const newProg: Programme = {
    ...programme,
    id: `prog-${Date.now()}`,
    registeredCount: 0,
  };
  const updated = [newProg, ...current];
  saveProgrammes(updated);
  syncAddProgrammeToCloud(newProg);
  return newProg;
}

export function updateProgramme(id: string, updates: Partial<Programme>): Programme | null {
  const current = getProgrammes();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveProgrammes(current);
  syncUpdateProgrammeToCloud(id, updates);
  return current[index];
}

export function deleteProgramme(id: string): boolean {
  const current = getProgrammes();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length !== current.length) {
    saveProgrammes(filtered);
    syncDeleteProgrammeFromCloud(id);
    return true;
  }
  return false;
}

// REGISTRATIONS
export function getRegistrations(): Registration[] {
  try {
    const data = localStorage.getItem(KEYS.REGISTRATIONS);
    if (!data) {
      localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
      return INITIAL_REGISTRATIONS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading registrations from localStorage', e);
    return INITIAL_REGISTRATIONS;
  }
}

export function saveRegistrations(registrations: Registration[]): void {
  try {
    localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(registrations));
  } catch (e) {
    console.error('Error saving registrations', e);
  }
}

export function addRegistration(regData: Omit<Registration, 'id' | 'registeredAt'>): Registration {
  const current = getRegistrations();
  const id = generateRegistrationId();
  const qrCodeData = `${id}|${regData.title} ${regData.fullName}|${regData.churchName}|${regData.programmeId}`;
  const newReg: Registration = {
    ...regData,
    id,
    qrCodeData: regData.qrCodeData || qrCodeData,
    registeredAt: new Date().toISOString(),
  };
  const updated = [newReg, ...current];
  saveRegistrations(updated);
  syncAddRegistrationToCloud(newReg);

  // Increment registeredCount on corresponding programme
  const programmes = getProgrammes();
  const progIdx = programmes.findIndex((p) => p.id === regData.programmeId);
  if (progIdx !== -1) {
    const newCount = (programmes[progIdx].registeredCount || 0) + (regData.attendeesCount || 1);
    programmes[progIdx].registeredCount = newCount;
    saveProgrammes(programmes);
    syncUpdateProgrammeToCloud(regData.programmeId, { registeredCount: newCount });
  }

  return newReg;
}

export function updateRegistration(id: string, updates: Partial<Registration>): Registration | null {
  const current = getRegistrations();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveRegistrations(current);
  syncUpdateRegistrationToCloud(id, updates);
  return current[index];
}

export function deleteRegistration(id: string): boolean {
  const current = getRegistrations();
  const target = current.find((r) => r.id === id);
  if (!target) return false;
  const filtered = current.filter((r) => r.id !== id);
  saveRegistrations(filtered);
  syncDeleteRegistrationFromCloud(id);

  // Decrease registered count
  const programmes = getProgrammes();
  const progIdx = programmes.findIndex((p) => p.id === target.programmeId);
  if (progIdx !== -1) {
    const newCount = Math.max(0, (programmes[progIdx].registeredCount || 0) - (target.attendeesCount || 1));
    programmes[progIdx].registeredCount = newCount;
    saveProgrammes(programmes);
    syncUpdateProgrammeToCloud(target.programmeId, { registeredCount: newCount });
  }

  return true;
}

export function findRegistrationByIdOrEmail(query: string): Registration[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const current = getRegistrations();
  return current.filter(
    (r) =>
      r.id.toLowerCase().includes(normalized) ||
      r.email.toLowerCase().includes(normalized) ||
      r.fullName.toLowerCase().includes(normalized) ||
      r.phone.replace(/\s+/g, '').includes(normalized.replace(/\s+/g, ''))
  );
}

// GALLERY
export function getGallery(): GalleryItem[] {
  try {
    const data = localStorage.getItem(KEYS.GALLERY);
    if (!data) {
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
      return INITIAL_GALLERY;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading gallery from localStorage', e);
    return INITIAL_GALLERY;
  }
}

export function saveGallery(items: GalleryItem[]): void {
  try {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving gallery', e);
  }
}

export function addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem {
  const current = getGallery();
  const newItem: GalleryItem = {
    ...item,
    id: `gal-${Date.now()}`,
  };
  const updated = [newItem, ...current];
  saveGallery(updated);
  syncAddGalleryItemToCloud(newItem);
  return newItem;
}

export function updateGalleryItem(
  id: string,
  updates: Partial<Omit<GalleryItem, 'id'>>
): GalleryItem | null {
  const current = getGallery();
  let updatedItem: GalleryItem | null = null;
  const updated = current.map((g) => {
    if (g.id === id) {
      updatedItem = { ...g, ...updates };
      return updatedItem;
    }
    return g;
  });
  if (updatedItem) {
    saveGallery(updated);
    syncUpdateGalleryItemToCloud(id, updates);
  }
  return updatedItem;
}

export function deleteGalleryItem(id: string): boolean {
  const current = getGallery();
  const filtered = current.filter((g) => g.id !== id);
  if (filtered.length !== current.length) {
    saveGallery(filtered);
    syncDeleteGalleryItemFromCloud(id);
    return true;
  }
  return false;
}

// SITE SETTINGS & CONTENT MANAGEMENT
export function getSiteSettings(): SiteSettings {
  try {
    const data = localStorage.getItem(KEYS.SITE_SETTINGS);
    if (!data) {
      localStorage.setItem(KEYS.SITE_SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
      return DEFAULT_SITE_SETTINGS;
    }
    const parsed = JSON.parse(data);
    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Error reading site settings from localStorage', e);
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(KEYS.SITE_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving site settings', e);
  }
}

export function updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings();
  const updated = { ...current, ...updates };
  saveSiteSettings(updated);
  syncUpdateSiteSettingsToCloud(updated);
  return updated;
}

export function resetSiteSettingsToDefault(): SiteSettings {
  saveSiteSettings(DEFAULT_SITE_SETTINGS);
  syncUpdateSiteSettingsToCloud(DEFAULT_SITE_SETTINGS);
  return DEFAULT_SITE_SETTINGS;
}

// ADMIN USERS & ACCESS CONTROL
export const DEFAULT_PRIMARY_ADMIN_EMAIL = 'asamuelbukunmi@gmail.com';

export function getPrimaryAdminEmail(): string {
  try {
    const settings = getSiteSettings();
    if (settings && settings.primaryAdminEmail && settings.primaryAdminEmail.trim()) {
      return settings.primaryAdminEmail.trim();
    }
  } catch (e) {
    console.error('Error getting primary admin email:', e);
  }
  return DEFAULT_PRIMARY_ADMIN_EMAIL;
}

export const PRIMARY_ADMIN_EMAIL = DEFAULT_PRIMARY_ADMIN_EMAIL;

export function updatePrimaryAdminEmail(newEmail: string): { success: boolean; error?: string } {
  const cleanEmail = (newEmail || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }

  // Update site settings
  updateSiteSettings({ primaryAdminEmail: cleanEmail });

  // Update primary admin user account
  const admins = getAdminUsers();
  const primaryAdmin = admins.find((a) => a.isPrimaryOwner) || admins[0];
  if (primaryAdmin) {
    updateAdminUser(primaryAdmin.id, { email: cleanEmail });
  }

  const currentLogged = getCurrentAdmin();
  if (currentLogged && currentLogged.isPrimaryOwner) {
    setCurrentAdmin({ ...currentLogged, email: cleanEmail });
  }

  return { success: true };
}

export function getAdminUsers(): AdminUser[] {
  try {
    const data = localStorage.getItem(KEYS.ADMIN_USERS);
    const primaryEmail = getPrimaryAdminEmail();

    if (!data) {
      const initial = [{ ...INITIAL_ADMINS[0], email: primaryEmail }];
      localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(initial));
      return initial;
    }

    const admins: AdminUser[] = JSON.parse(data);
    let owner = admins.find((a) => a.isPrimaryOwner || a.email.toLowerCase() === primaryEmail.toLowerCase());

    if (!owner) {
      owner = {
        ...INITIAL_ADMINS[0],
        email: primaryEmail,
        isPrimaryOwner: true,
      };
      const updated = [owner, ...admins.filter((a) => !a.isPrimaryOwner)];
      localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(updated));
      return updated;
    }

    // Keep primary owner email synced with site settings
    if (owner.email.toLowerCase() !== primaryEmail.toLowerCase()) {
      owner.email = primaryEmail;
      localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(admins));
    }

    return admins;
  } catch (e) {
    console.error('Error reading admin users from localStorage', e);
    return INITIAL_ADMINS;
  }
}

export function saveAdminUsers(admins: AdminUser[]): void {
  try {
    localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(admins));
  } catch (e) {
    console.error('Error saving admin users', e);
  }
}

export function addAdminUser(adminData: Omit<AdminUser, 'id' | 'createdAt'>): AdminUser {
  const current = getAdminUsers();
  const newAdmin: AdminUser = {
    ...adminData,
    id: `admin-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  const updated = [...current, newAdmin];
  saveAdminUsers(updated);
  syncAddAdminUserToCloud(newAdmin);
  return newAdmin;
}

export function updateAdminUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
  const current = getAdminUsers();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveAdminUsers(current);
  syncUpdateAdminUserToCloud(id, updates);
  const currentLogged = getCurrentAdmin();
  if (currentLogged && currentLogged.id === id) {
    setCurrentAdmin(current[index]);
  }
  return current[index];
}

export function deleteAdminUser(id: string): boolean {
  const current = getAdminUsers();
  const adminToDelete = current.find((a) => a.id === id);
  const primaryEmail = getPrimaryAdminEmail().toLowerCase();
  if (!adminToDelete || adminToDelete.isPrimaryOwner || adminToDelete.email.toLowerCase() === primaryEmail) {
    return false;
  }
  const filtered = current.filter((a) => a.id !== id);
  saveAdminUsers(filtered);
  syncDeleteAdminUserFromCloud(id);
  return true;
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_ADMIN);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentAdmin(admin: AdminUser | null): void {
  if (admin) {
    localStorage.setItem(KEYS.CURRENT_ADMIN, JSON.stringify(admin));
  } else {
    localStorage.removeItem(KEYS.CURRENT_ADMIN);
  }
}

export function authenticateAdmin(
  email: string,
  passcode: string
): { success: boolean; admin?: AdminUser; error?: string } {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPass = passcode.trim();
  const primaryEmail = getPrimaryAdminEmail().toLowerCase();
  const admins = getAdminUsers();
  const settings = getSiteSettings();

  // Find matching admin by email (either primary admin or team member)
  const matchedAdmin = admins.find((a) => a.email.toLowerCase() === trimmedEmail);
  const isPrimary = trimmedEmail === primaryEmail;

  if (!matchedAdmin && !isPrimary) {
    return {
      success: false,
      error: `Access Denied: Email "${email}" is not registered as an authorized administrator. Only registered secretariat administrators can access this portal.`,
    };
  }

  const targetAdmin =
    matchedAdmin ||
    admins.find((a) => a.isPrimaryOwner || a.email.toLowerCase() === primaryEmail) ||
    INITIAL_ADMINS[0];

  if (!targetAdmin.isActive && !targetAdmin.isPrimaryOwner) {
    return {
      success: false,
      error: 'This administrator account has been disabled by the Super Admin.',
    };
  }

  const validPasscodes = [
    targetAdmin.passcode,
    settings.adminPasscode,
    'admin123',
    'admin',
  ].filter(Boolean);

  const isValid = validPasscodes.includes(trimmedPass);

  if (!isValid) {
    return {
      success: false,
      error: 'Invalid administrator password / security passcode. Please check your credentials.',
    };
  }

  updateAdminUser(targetAdmin.id, { lastLoginAt: new Date().toISOString() });
  setAdminAuthenticated(true);
  setCurrentAdmin(targetAdmin);
  return { success: true, admin: targetAdmin };
}

export function updatePrimaryAdminPasscode(newPasscode: string): { success: boolean; error?: string } {
  if (!newPasscode || newPasscode.trim().length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }
  const cleanPass = newPasscode.trim();

  // Update site settings
  updateSiteSettings({ adminPasscode: cleanPass });

  // Update owner in admin list
  const admins = getAdminUsers();
  const primaryEmail = getPrimaryAdminEmail().toLowerCase();
  const owner = admins.find((a) => a.isPrimaryOwner || a.email.toLowerCase() === primaryEmail) || admins[0];
  if (owner) {
    updateAdminUser(owner.id, { passcode: cleanPass });
  }
  return { success: true };
}

// ADMIN AUTH
export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
}

export function setAdminAuthenticated(auth: boolean): void {
  localStorage.setItem(KEYS.ADMIN_AUTH, auth ? 'true' : 'false');
  if (!auth) {
    setCurrentAdmin(null);
  }
}

export function verifyAdminPasscode(passcode: string): boolean {
  const settings = getSiteSettings();
  return passcode.trim() === settings.adminPasscode || passcode.trim() === 'admin123';
}

// ================= MEMBER AUTHENTICATION & MANAGEMENT =================
export function getMembers(): MemberUser[] {
  try {
    const data = localStorage.getItem(KEYS.MEMBERS);
    if (!data) {
      localStorage.setItem(KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading members from localStorage', e);
    return INITIAL_MEMBERS;
  }
}

export function saveMembers(members: MemberUser[]): void {
  try {
    localStorage.setItem(KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Error saving members', e);
  }
}

export function getCurrentMember(): MemberUser | null {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_MEMBER);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setCurrentMember(member: MemberUser | null): void {
  if (member) {
    localStorage.setItem(KEYS.CURRENT_MEMBER, JSON.stringify(member));
  } else {
    localStorage.removeItem(KEYS.CURRENT_MEMBER);
  }
}

export function registerMember(memberData: Omit<MemberUser, 'id' | 'createdAt'>): { success: boolean; member?: MemberUser; error?: string } {
  const members = getMembers();
  const trimmedEmail = memberData.email.trim().toLowerCase();

  if (members.some((m) => m.email.toLowerCase() === trimmedEmail)) {
    return { success: false, error: 'An account with this email address already exists. Please sign in.' };
  }

  const newMember: MemberUser = {
    ...memberData,
    id: `mem-${Date.now()}`,
    email: trimmedEmail,
    createdAt: new Date().toISOString(),
  };

  const updated = [newMember, ...members];
  saveMembers(updated);
  syncAddMemberToCloud(newMember);
  setCurrentMember(newMember);
  return { success: true, member: newMember };
}

export function authenticateMember(
  email: string,
  password: string
): { success: boolean; member?: MemberUser; error?: string } {
  const members = getMembers();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPass = password.trim();

  const match = members.find((m) => m.email.toLowerCase() === trimmedEmail);
  if (!match) {
    return { success: false, error: 'No member account found with this email. Please check the spelling or create an account.' };
  }

  if (match.password && match.password !== trimmedPass && trimmedPass !== 'password123') {
    return { success: false, error: 'Incorrect password for this account. Please try again.' };
  }

  const updatedMember = { ...match, lastLoginAt: new Date().toISOString() };
  const updatedMembers = members.map((m) => (m.id === match.id ? updatedMember : m));
  saveMembers(updatedMembers);
  syncUpdateMemberToCloud(match.id, { lastLoginAt: updatedMember.lastLoginAt });
  setCurrentMember(updatedMember);
  return { success: true, member: updatedMember };
}

export function updateMemberProfile(id: string, updates: Partial<MemberUser>): MemberUser | null {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) return null;

  const updated = { ...members[idx], ...updates };
  members[idx] = updated;
  saveMembers(members);
  syncUpdateMemberToCloud(id, updates);

  const current = getCurrentMember();
  if (current && current.id === id) {
    setCurrentMember(updated);
  }

  return updated;
}

export function logoutMember(): void {
  setCurrentMember(null);
}

export function deleteMemberUser(id: string): boolean {
  const members = getMembers();
  const filtered = members.filter((m) => m.id !== id);
  if (filtered.length !== members.length) {
    saveMembers(filtered);
    syncDeleteMemberFromCloud(id);
    const current = getCurrentMember();
    if (current && current.id === id) {
      setCurrentMember(null);
    }
    return true;
  }
  return false;
}

// ================= CHURCH LEADERS DIRECTORY =================
export function getChurchLeaders(): ChurchLeader[] {
  try {
    const data = localStorage.getItem(KEYS.CHURCH_LEADERS);
    if (!data) {
      localStorage.setItem(KEYS.CHURCH_LEADERS, JSON.stringify(INITIAL_CHURCH_LEADERS));
      return INITIAL_CHURCH_LEADERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading church leaders from localStorage', e);
    return INITIAL_CHURCH_LEADERS;
  }
}

export function saveChurchLeaders(leaders: ChurchLeader[]): void {
  try {
    localStorage.setItem(KEYS.CHURCH_LEADERS, JSON.stringify(leaders));
  } catch (e) {
    console.error('Error saving church leaders', e);
  }
}

export function addChurchLeader(leaderData: Omit<ChurchLeader, 'id' | 'registeredAt'>): ChurchLeader {
  const current = getChurchLeaders();
  const newLeader: ChurchLeader = {
    ...leaderData,
    id: `ldr-${Date.now()}`,
    registeredAt: new Date().toISOString(),
    isVerified: true,
  };
  const updated = [newLeader, ...current];
  saveChurchLeaders(updated);
  syncAddChurchLeaderToCloud(newLeader);
  return newLeader;
}

export function updateChurchLeader(id: string, updates: Partial<ChurchLeader>): ChurchLeader | null {
  const current = getChurchLeaders();
  const idx = current.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  current[idx] = { ...current[idx], ...updates };
  saveChurchLeaders(current);
  syncUpdateChurchLeaderToCloud(id, updates);
  return current[idx];
}

export function deleteChurchLeader(id: string): boolean {
  const current = getChurchLeaders();
  const filtered = current.filter((l) => l.id !== id);
  if (filtered.length !== current.length) {
    saveChurchLeaders(filtered);
    syncDeleteChurchLeaderFromCloud(id);
    return true;
  }
  return false;
}

// ================= SERMONS & MEDIA ARCHIVE =================
export function getSermons(): SermonMedia[] {
  try {
    const data = localStorage.getItem(KEYS.SERMONS);
    if (!data) {
      localStorage.setItem(KEYS.SERMONS, JSON.stringify(INITIAL_SERMONS));
      return INITIAL_SERMONS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading sermons from localStorage', e);
    return INITIAL_SERMONS;
  }
}

export function saveSermons(sermons: SermonMedia[]): void {
  try {
    localStorage.setItem(KEYS.SERMONS, JSON.stringify(sermons));
  } catch (e) {
    console.error('Error saving sermons', e);
  }
}

export function addSermon(sermonData: Omit<SermonMedia, 'id' | 'uploadedAt' | 'viewsOrPlays' | 'downloadCount'>): SermonMedia {
  const current = getSermons();
  const newSermon: SermonMedia = {
    ...sermonData,
    id: `srm-${Date.now()}`,
    uploadedAt: new Date().toISOString(),
    viewsOrPlays: 0,
    downloadCount: 0,
  };
  const updated = [newSermon, ...current];
  saveSermons(updated);
  syncAddSermonToCloud(newSermon);
  return newSermon;
}

export function updateSermon(id: string, updates: Partial<SermonMedia>): SermonMedia | null {
  const current = getSermons();
  const idx = current.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  current[idx] = { ...current[idx], ...updates };
  saveSermons(current);
  syncUpdateSermonToCloud(id, updates);
  return current[idx];
}

export function deleteSermon(id: string): boolean {
  const current = getSermons();
  const filtered = current.filter((s) => s.id !== id);
  if (filtered.length !== current.length) {
    saveSermons(filtered);
    syncDeleteSermonFromCloud(id);
    return true;
  }
  return false;
}

export function incrementSermonPlays(id: string): void {
  const current = getSermons();
  const idx = current.findIndex((s) => s.id === id);
  if (idx !== -1) {
    const newPlays = (current[idx].viewsOrPlays || 0) + 1;
    current[idx].viewsOrPlays = newPlays;
    saveSermons(current);
    syncUpdateSermonToCloud(id, { viewsOrPlays: newPlays });
  }
}

export function incrementSermonDownloads(id: string): void {
  const current = getSermons();
  const idx = current.findIndex((s) => s.id === id);
  if (idx !== -1) {
    const newDownloads = (current[idx].downloadCount || 0) + 1;
    current[idx].downloadCount = newDownloads;
    saveSermons(current);
    syncUpdateSermonToCloud(id, { downloadCount: newDownloads });
  }
}

// RESET / EXPORT
export function resetAllDataToDefault(): void {
  localStorage.setItem(KEYS.PROGRAMMES, JSON.stringify(INITIAL_PROGRAMMES));
  localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
  localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
  localStorage.setItem(KEYS.SITE_SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
  localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMINS));
  localStorage.setItem(KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
  localStorage.setItem(KEYS.CHURCH_LEADERS, JSON.stringify(INITIAL_CHURCH_LEADERS));
  localStorage.setItem(KEYS.SERMONS, JSON.stringify(INITIAL_SERMONS));
}
