import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  X,
  Shield,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';
import { AdminUser, AdminRole } from '../types';
import {
  getAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../utils/storage';

interface AdminTeamManagerProps {
  currentLoggedInAdmin: AdminUser | null;
  onAdminsUpdated: () => void;
}

const ROLE_INFO: Record<
  AdminRole,
  { label: string; description: string; badgeColor: string }
> = {
  super_admin: {
    label: 'Super Admin (Full Access)',
    description:
      'Full administrative access to programmes, registrations, site customizer, financials, and team management.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  secretariat_admin: {
    label: 'Secretariat Executive',
    description:
      'Manages ministry programmes, delegate registrations, official letters, and gallery archives.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  registration_officer: {
    label: 'Accreditation & Desk Officer',
    description:
      'Manages attendee check-ins, barcode/QR accreditation scanner, and badge printing.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  media_manager: {
    label: 'Media & Gallery Manager',
    description:
      'Manages programme photo archives, testimonies, and media releases.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
  },
};

export const AdminTeamManager: React.FC<AdminTeamManagerProps> = ({
  currentLoggedInAdmin,
  onAdminsUpdated,
}) => {
  const [admins, setAdmins] = useState<AdminUser[]>(getAdminUsers());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AdminRole>('secretariat_admin');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const refreshAdmins = () => {
    const updated = getAdminUsers();
    setAdmins(updated);
    onAdminsUpdated();
  };

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('secretariat_admin');
    setPasscode('');
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPhone(admin.phone || '');
    setRole(admin.role);
    setPasscode(admin.passcode);
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Full name is required');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('A valid administrative email address is required');
      return;
    }

    if (!passcode.trim() || passcode.trim().length < 4) {
      setFormError('Passcode/Password must be at least 4 characters long');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existing = admins.find(
      (a) => a.email.toLowerCase() === trimmedEmail && a.id !== editingAdmin?.id
    );
    if (existing) {
      setFormError('An administrator with this email address already exists.');
      return;
    }

    if (editingAdmin) {
      updateAdminUser(editingAdmin.id, {
        name: name.trim(),
        email: trimmedEmail,
        phone: phone.trim(),
        role,
        passcode: passcode.trim(),
      });
      setSuccessToast(`Admin account for "${name}" updated successfully.`);
    } else {
      addAdminUser({
        name: name.trim(),
        email: trimmedEmail,
        phone: phone.trim(),
        role,
        passcode: passcode.trim(),
        isActive: true,
      });
      setSuccessToast(`New administrator "${name}" created successfully.`);
    }

    refreshAdmins();
    setIsAddModalOpen(false);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const handleToggleStatus = (admin: AdminUser) => {
    if (admin.isPrimaryOwner) {
      alert('The primary master account cannot be deactivated.');
      return;
    }
    const newStatus = !admin.isActive;
    updateAdminUser(admin.id, { isActive: newStatus });
    refreshAdmins();
    setSuccessToast(
      `Account status for ${admin.name} set to ${newStatus ? 'Active' : 'Disabled'}.`
    );
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleDelete = (admin: AdminUser) => {
    if (admin.isPrimaryOwner) {
      alert('The primary master super-admin account cannot be removed.');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to remove administrator "${admin.name}" (${admin.email})?`
      )
    ) {
      deleteAdminUser(admin.id);
      refreshAdmins();
      setSuccessToast(`Administrator ${admin.name} removed.`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-sm">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Info */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Access Control & Team Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            Administrative Team & Access Permissions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            You are logged in as the Super Admin. Create and manage administrative accounts for your
            secretariat team, assigning custom access roles.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Administrator</span>
        </button>
      </div>

      {/* Primary Owner Badge Box */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold font-serif text-lg shrink-0 shadow-sm">
            BS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-base">
                Bukunmi Samuel (Primary Master Owner)
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold text-[10px] uppercase border border-amber-400">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Primary login email:{' '}
              <strong className="text-slate-900 font-mono">asamuelbukunmi@gmail.com</strong> •
              Full governance rights over this platform.
            </p>
          </div>
        </div>
        <div className="text-xs text-amber-900 bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
          Protected Account
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base font-serif text-slate-900">
            Active Administrative Staff ({admins.length})
          </h3>
          <span className="text-xs text-slate-500">
            Only authorized team members can log into the Secretariat Portal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Administrator</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Role & Permissions</th>
                <th className="py-3.5 px-4">Security Passcode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {admins.map((admin) => {
                const roleMeta = ROLE_INFO[admin.role] || ROLE_INFO.secretariat_admin;
                const isCurrent = currentLoggedInAdmin?.id === admin.id;

                return (
                  <tr key={admin.id} className="hover:bg-slate-50/80 transition">
                    {/* Admin Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{admin.name}</span>
                            {admin.isPrimaryOwner && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded font-bold border border-amber-300">
                                Owner
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-semibold border border-emerald-300">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            Added: {admin.createdAt}{' '}
                            {admin.lastLoginAt
                              ? `• Last active: ${new Date(admin.lastLoginAt).toLocaleDateString()}`
                              : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 font-mono text-xs">
                        {admin.email}
                      </div>
                      {admin.phone && (
                        <div className="text-[11px] text-slate-500">{admin.phone}</div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleMeta.badgeColor}`}
                      >
                        {roleMeta.label}
                      </span>
                    </td>

                    {/* Passcode */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">
                        ••••••••
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        disabled={admin.isPrimaryOwner}
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border cursor-pointer ${
                          admin.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        } ${admin.isPrimaryOwner ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {admin.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(admin)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition cursor-pointer"
                          title="Edit admin details & passcode"
                        >
                          <Edit3 className="w-4 h-4 text-amber-700" />
                        </button>
                        {!admin.isPrimaryOwner && (
                          <button
                            onClick={() => handleDelete(admin)}
                            className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                            title="Remove admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Admin Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold font-serif text-lg">
                  {editingAdmin ? 'Edit Administrator Account' : 'Add New Administrator'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="p-6 space-y-4 text-sm">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pastor David Adeleke"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Login Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin.name@ministersconnect.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  placeholder="+234 803 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Role & Permissions
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminRole)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                >
                  <option value="super_admin">Super Admin (Full Platform Control)</option>
                  <option value="secretariat_admin">
                    Secretariat Executive (Programmes & Registrations)
                  </option>
                  <option value="registration_officer">
                    Accreditation Officer (Scanner & Badges)
                  </option>
                  <option value="media_manager">Media Manager (Gallery & Photos)</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">{ROLE_INFO[role]?.description}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Passcode / Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter security passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {editingAdmin ? 'Update Administrator' : 'Create Administrator'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
