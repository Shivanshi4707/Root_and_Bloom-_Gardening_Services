import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  X,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface ManagerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HUBS = [
  'Indiranagar Central Hub #01 (Bengaluru)',
  'Koramangala South Hub #02 (Bengaluru)',
  'Bandra West Hub #03 (Mumbai)',
  'GK-1 Metro Hub #04 (New Delhi)',
  'Jubilee Hills Hub #05 (Hyderabad)',
];

export const ManagerAuthModal: React.FC<ManagerAuthModalProps> = ({ isOpen, onClose }) => {
  const { managerLogin, managerRegister } = useApp();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign in form state
  const [email, setEmail] = useState('manager@rootandbloom.in');
  const [password, setPassword] = useState('admin123');
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign up form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [staffPasscode, setStaffPasscode] = useState('');
  const [newHub, setNewHub] = useState(HUBS[0]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your staff email and password.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid staff email address.');
      return;
    }

    setIsLoading(true);
    const result = await managerLogin(email.trim(), password, selectedHub);
    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Invalid credentials or staff passcode.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newName || !newEmail || !newPassword) {
      setError('All fields are required for staff registration.');
      return;
    }

    if (staffPasscode.trim() !== 'BLOOM2026' && staffPasscode.trim() !== 'ROOTADMIN') {
      setError('Invalid Central Ops Verification Passcode. Contact Central Ops (Code: BLOOM2026).');
      return;
    }

    setIsLoading(true);
    const result = await managerRegister({
      name: newName.trim(),
      email: newEmail.trim(),
      password: newPassword,
      hub: newHub,
      staffPasscode: staffPasscode.trim(),
    });
    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Staff registration failed.');
    }
  };

  const fillDemoManager = () => {
    setEmail('manager@rootandbloom.in');
    setPassword('admin123');
    setSelectedHub(HUBS[0]);
    setError('');
  };

  return (
    <div
      id="manager-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#DFD8CB] shadow-2xl overflow-hidden relative animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-[#1A3828] text-white p-6 relative">
          <button
            id="close-manager-auth-modal"
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close manager login"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D27D46] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-lg">Staff Operations Portal</h3>
                <span className="text-[10px] bg-white/20 text-[#A7F3D0] px-2 py-0.5 rounded-sm font-semibold">
                  Internal Ops Only
                </span>
              </div>
              <p className="text-xs text-white/70">
                Root & Bloom Dispatch & Operations Hub Terminal
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EAE4D7] bg-[#FAF8F5]">
          <button
            id="tab-manager-signin"
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              authMode === 'signin'
                ? 'border-[#1A3828] text-[#1A3828] bg-white'
                : 'border-transparent text-[#627A6C] hover:text-[#1A3828]'
            }`}
          >
            Manager Sign In
          </button>
          <button
            id="tab-manager-signup"
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setError('');
            }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              authMode === 'signup'
                ? 'border-[#1A3828] text-[#1A3828] bg-white'
                : 'border-transparent text-[#627A6C] hover:text-[#1A3828]'
            }`}
          >
            New Staff Sign Up
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#496253] mb-1.5">
                  Operations Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A9384] absolute left-3.5 top-3" />
                  <input
                    id="manager-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@rootandbloom.in"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#496253] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A9384] absolute left-3.5 top-3" />
                  <input
                    id="manager-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#496253] mb-1.5">
                  Assigned Dark-Store Hub
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#7A9384] absolute left-3.5 top-3" />
                  <select
                    id="manager-hub-select"
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  >
                    {HUBS.map((hub) => (
                      <option key={hub} value={hub}>
                        {hub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  id="manager-login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A3828] hover:bg-[#12281D] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-[#1A3828]/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8FE388]" />
                  <span>{isLoading ? 'Verifying Credentials...' : 'Access Manager Dashboard'}</span>
                </button>

                {/* 1-Click Demo Fill */}
                <button
                  id="manager-demo-fill-btn"
                  type="button"
                  onClick={fillDemoManager}
                  className="w-full py-2 rounded-xl bg-[#FAF8F5] border border-[#DFD8CB] hover:bg-[#F2ECE1] text-[11px] font-semibold text-[#2A5C43] transition-colors flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D27D46]" />
                  <span>Fill Demo Credentials (manager@rootandbloom.in)</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#496253] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7A9384] absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#496253] mb-1">
                  Staff Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A9384] absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@rootandbloom.in"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#496253] mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7A9384] absolute left-3.5 top-2.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#496253] mb-1">
                  Ops Verification Passcode (Internal: BLOOM2026)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#7A9384] absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={staffPasscode}
                    onChange={(e) => setStaffPasscode(e.target.value)}
                    placeholder="Enter BLOOM2026"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#496253] mb-1">
                  Hub Location
                </label>
                <select
                  value={newHub}
                  onChange={(e) => setNewHub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                >
                  {HUBS.map((hub) => (
                    <option key={hub} value={hub}>
                      {hub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#D27D46] hover:bg-[#BC6B38] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-[#D27D46]/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70"
                >
                  <span>{isLoading ? 'Registering...' : 'Register Staff & Enter Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 pt-3 border-t border-[#EAE4D7] text-center text-[11px] text-[#698273]">
            <span>Unauthorized access is strictly logged for security compliance.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
