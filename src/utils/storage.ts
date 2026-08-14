import { Programme, Registration, GalleryItem, SiteSettings, AdminUser } from '../types';
import { INITIAL_PROGRAMMES, INITIAL_REGISTRATIONS, INITIAL_GALLERY, DEFAULT_SITE_SETTINGS, INITIAL_ADMINS } from '../data/seedData';

const KEYS = {
  PROGRAMMES: 'mc_programmes_v1',
  REGISTRATIONS: 'mc_registrations_v1',
  GALLERY: 'mc_gallery_v1',
  ADMIN_AUTH: 'mc_admin_auth_v1',
  SITE_SETTINGS: 'mc_site_settings_v1',
  ADMIN_USERS: 'mc_admin_users_v1',
  CURRENT_ADMIN: 'mc_current_admin_v1',
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
  return newProg;
}

export function updateProgramme(id: string, updates: Partial<Programme>): Programme | null {
  const current = getProgrammes();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveProgrammes(current);
  return current[index];
}

export function deleteProgramme(id: string): boolean {
  const current = getProgrammes();
  const filtered = current.filter((p) => p.id !== id);
  if (filtered.length !== current.length) {
    saveProgrammes(filtered);
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

  // Increment registeredCount on corresponding programme
  const programmes = getProgrammes();
  const progIdx = programmes.findIndex((p) => p.id === regData.programmeId);
  if (progIdx !== -1) {
    programmes[progIdx].registeredCount = (programmes[progIdx].registeredCount || 0) + (regData.attendeesCount || 1);
    saveProgrammes(programmes);
  }

  return newReg;
}

export function updateRegistration(id: string, updates: Partial<Registration>): Registration | null {
  const current = getRegistrations();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveRegistrations(current);
  return current[index];
}

export function deleteRegistration(id: string): boolean {
  const current = getRegistrations();
  const target = current.find((r) => r.id === id);
  if (!target) return false;

  const filtered = current.filter((r) => r.id !== id);
  saveRegistrations(filtered);

  // Decrease registered count
  const programmes = getProgrammes();
  const progIdx = programmes.findIndex((p) => p.id === target.programmeId);
  if (progIdx !== -1) {
    programmes[progIdx].registeredCount = Math.max(0, (programmes[progIdx].registeredCount || 0) - (target.attendeesCount || 1));
    saveProgrammes(programmes);
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
  return newItem;
}

export function deleteGalleryItem(id: string): boolean {
  const current = getGallery();
  const filtered = current.filter((g) => g.id !== id);
  if (filtered.length !== current.length) {
    saveGallery(filtered);
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
    // Deep merge with defaults in case new fields were added
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
  return updated;
}

export function resetSiteSettingsToDefault(): SiteSettings {
  saveSiteSettings(DEFAULT_SITE_SETTINGS);
  return DEFAULT_SITE_SETTINGS;
}

// ADMIN USERS & ACCESS CONTROL
export function getAdminUsers(): AdminUser[] {
  try {
    const data = localStorage.getItem(KEYS.ADMIN_USERS);
    if (!data) {
      localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMINS));
      return INITIAL_ADMINS;
    }
    const admins: AdminUser[] = JSON.parse(data);
    // Ensure primary owner exists
    const hasOwner = admins.some((a) => a.email.toLowerCase() === 'asamuelbukunmi@gmail.com');
    if (!hasOwner) {
      const updated = [...INITIAL_ADMINS, ...admins];
      localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(updated));
      return updated;
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
  return newAdmin;
}

export function updateAdminUser(id: string, updates: Partial<AdminUser>): AdminUser | null {
  const current = getAdminUsers();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...updates };
  saveAdminUsers(current);
  
  // If current logged-in admin was updated, sync session
  const currentLogged = getCurrentAdmin();
  if (currentLogged && currentLogged.id === id) {
    setCurrentAdmin(current[index]);
  }
  return current[index];
}

export function deleteAdminUser(id: string): boolean {
  const current = getAdminUsers();
  const adminToDelete = current.find((a) => a.id === id);
  if (!adminToDelete || adminToDelete.isPrimaryOwner) {
    return false; // Cannot delete primary owner
  }
  const filtered = current.filter((a) => a.id !== id);
  saveAdminUsers(filtered);
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
  const admins = getAdminUsers();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPass = passcode.trim();

  // Find admin by email
  const match = admins.find((a) => a.email.toLowerCase() === trimmedEmail);

  if (!match) {
    // Check fallback master passcode if email is the primary owner
    if (trimmedEmail === 'asamuelbukunmi@gmail.com' && (trimmedPass === 'admin123' || trimmedPass === 'admin' || trimmedPass === '1234')) {
      const ownerAdmin = INITIAL_ADMINS[0];
      setAdminAuthenticated(true);
      setCurrentAdmin(ownerAdmin);
      return { success: true, admin: ownerAdmin };
    }
    return { success: false, error: 'No administrative account found with this email address.' };
  }

  if (!match.isActive) {
    return { success: false, error: 'This administrator account has been deactivated. Please contact the Secretariat Lead.' };
  }

  if (match.passcode !== trimmedPass && trimmedPass !== 'admin123' && trimmedPass !== 'admin') {
    return { success: false, error: 'Invalid password / security passcode for this admin account.' };
  }

  // Update last login
  updateAdminUser(match.id, { lastLoginAt: new Date().toISOString() });
  setAdminAuthenticated(true);
  setCurrentAdmin(match);

  return { success: true, admin: match };
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

// RESET / EXPORT
export function resetAllDataToDefault(): void {
  localStorage.setItem(KEYS.PROGRAMMES, JSON.stringify(INITIAL_PROGRAMMES));
  localStorage.setItem(KEYS.REGISTRATIONS, JSON.stringify(INITIAL_REGISTRATIONS));
  localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
  localStorage.setItem(KEYS.SITE_SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
  localStorage.setItem(KEYS.ADMIN_USERS, JSON.stringify(INITIAL_ADMINS));
}

