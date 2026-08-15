import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Church,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MinisterialTitle, MinisterialPosition, MemberUser } from '../types';
import { authenticateMember, registerMember, getMembers } from '../utils/storage';
import { PassportPhotoSelector } from './PassportPhotoSelector';

interface MemberAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (member: MemberUser) => void;
  initialMode?: 'signin' | 'signup';
  promptMessage?: string;
}

const MINISTERIAL_TITLES: MinisterialTitle[] = [
  'Pastor',
  'Reverend',
  'Bishop',
  'Apostle',
  'Evangelist',
  'Prophet',
  'Prophetess',
  'Teacher',
  'Deacon',
  'Deaconess',
  'Elder',
  'Minister',
  'Brother',
  'Sister',
  'Dr.',
  'Other',
];

const MINISTERIAL_POSITIONS: MinisterialPosition[] = [
  'Senior Pastor / General Overseer',
  'Associate / Resident Pastor',
  'Youth / Campus Pastor',
  'Children / Teens Minister',
  'Music / Worship Director',
  'Evangelist / Outreach Director',
  'Missions Coordinator',
  'Church Administrator / Executive',
  'Prayer / Intercession Leader',
  'Bible Study / Christian Education Teacher',
  'Church Worker / Deacon / Elder',
  'Other',
];

export const MemberAuthModal: React.FC<MemberAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
  promptMessage,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Synchronize mode whenever modal is opened with an initialMode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, initialMode]);

  // Sign in fields
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign up fields
  const [title, setTitle] = useState<MinisterialTitle>('Pastor');
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [churchName, setChurchName] = useState('');
  const [position, setPosition] = useState<MinisterialPosition>('Senior Pastor / General Overseer');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Abuja FCT');
  const [country, setCountry] = useState('Nigeria');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickFillDemo = (email: string) => {
    setSignInEmail(email);
    setSignInPassword('password123');
    setError(null);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signInEmail.trim()) {
      setError('Please enter your member email address.');
      return;
    }
    if (!signInPassword) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = authenticateMember(signInEmail, signInPassword);
      setLoading(false);

      if (res.success && res.member) {
        setSuccessMessage(`Welcome back, ${res.member.title} ${res.member.fullName}!`);
        setTimeout(() => {
          onSuccess(res.member!);
          onClose();
        }, 500);
      } else {
        setError(res.error || 'Authentication failed. Please check your email and password.');
      }
    }, 350);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please provide your Full Name (e.g. Pastor Samuel Bukunmi).');
      return;
    }
    if (!signUpEmail.trim() || !/\S+@\S+\.\S+/.test(signUpEmail)) {
      setError('Please provide a valid Email address.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (signUpConfirmPassword && signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide your Phone number.');
      return;
    }
    if (!churchName.trim()) {
      setError('Please provide your Church or Ministry name.');
      return;
    }
    if (!city.trim()) {
      setError('Please enter your City / Town.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = registerMember({
        email: signUpEmail.trim().toLowerCase(),
        password: signUpPassword,
        title,
        fullName: fullName.trim(),
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        churchName: churchName.trim(),
        ministerialPosition: position,
        city: city.trim(),
        state: state.trim() || undefined,
        country: country.trim(),
        avatarUrl: avatarUrl || undefined,
      });

      setLoading(false);

      if (res.success && res.member) {
        setSuccessMessage('Member account created successfully! You are now signed in.');
        setTimeout(() => {
          onSuccess(res.member!);
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Registration failed. An account with this email may already exist.');
      }
    }, 400);
  };

  const sampleMembers = getMembers().slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-5 sm:p-6 relative border-b border-amber-500/20">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Member Authentication Gateway</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            {mode === 'signup' ? 'Create Your Member Account' : 'Sign In to Member Account'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
            {promptMessage ||
              (mode === 'signup'
                ? 'Sign up with your details and a password to unlock registration forms, download official credentials, and join the ministers fellowship.'
                : 'Enter your member email and password to access your credentials and register for upcoming programmes.')}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 bg-slate-800/90 p-1.5 rounded-2xl mt-4 border border-slate-700/80">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up (New Account)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In (Existing)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto">
          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-bold">{successMessage}</div>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
                  Member Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. pastor@churchname.org"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    autoFocus
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">
                    Account Password <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Your created password</span>
                </div>
                <div className="relative">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-xl text-sm shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Password</span>
                  </>
                )}
              </button>

              {/* Demo Accounts Quick Login */}
              {sampleMembers.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quick One-Click Demo Member Logins:</span>
                  </p>
                  <div className="space-y-1.5">
                    {sampleMembers.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleQuickFillDemo(m.email)}
                        className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition text-xs flex items-center justify-between group cursor-pointer"
                      >
                        <div className="truncate">
                          <span className="font-bold text-slate-800">
                            {m.title} {m.fullName}
                          </span>
                          <span className="text-slate-500 text-[11px] block">{m.email}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-amber-700 opacity-0 group-hover:opacity-100 transition">
                          Select →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value as MinisterialTitle)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {MINISTERIAL_TITLES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Bukunmi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="pastor@churchname.org"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Set Password <span className="text-red-500">*</span> (min 6 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showSignUpPassword ? 'text' : 'password'}
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (!whatsapp) setWhatsapp(e.target.value);
                    }}
                    placeholder="+234 803 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Church / Ministry <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={churchName}
                    onChange={(e) => setChurchName(e.target.value)}
                    placeholder="e.g. Dominion Faith Ministry"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ministerial Role / Position <span className="text-red-500">*</span>
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as MinisterialPosition)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-amber-500"
                >
                  {MINISTERIAL_POSITIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Abuja"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. FCT"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Nigeria"
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <PassportPhotoSelector
                  value={avatarUrl}
                  onChange={(photo) => setAvatarUrl(photo)}
                  label="Passport Photo / Portrait (Optional for Badge)"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-700 hover:to-amber-700 text-white font-bold rounded-xl text-sm shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Member Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account & Unlock Forms</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-600">
          {mode === 'signin' ? (
            <span>
              Don't have a member account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="text-amber-700 hover:underline font-bold cursor-pointer"
              >
                Sign Up here
              </button>
            </span>
          ) : (
            <span>
              Already registered as a member?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className="text-amber-700 hover:underline font-bold cursor-pointer"
              >
                Sign In with Password here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
