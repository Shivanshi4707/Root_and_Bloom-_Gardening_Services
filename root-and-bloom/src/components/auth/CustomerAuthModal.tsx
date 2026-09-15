import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Package,
  Calendar,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { CustomerAuthMode } from '../../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose }) => {
  const {
    currentCustomer,
    customerAuthMode,
    setCustomerAuthMode,
    customerLogin,
    customerSignUp,
    customerLogout,
    customerForgotPassword,
    customerResetPassword,
    updateCustomerProfile,
    changeCustomerPassword,
    setPage,
    orders,
    bookings,
  } = useApp();

  // Mode state: 'signin' | 'signup' | 'forgot' | 'reset' | 'profile'
  const [activeView, setActiveView] = useState<CustomerAuthMode>(
    currentCustomer ? 'profile' : customerAuthMode || 'signin'
  );

  // Sync mode whenever modal opens or currentCustomer changes
  useEffect(() => {
    if (isOpen) {
      if (currentCustomer) {
        setActiveView('profile');
      } else {
        setActiveView(customerAuthMode || 'signin');
      }
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [isOpen, currentCustomer, customerAuthMode]);

  // Form states
  const [signInEmail, setSignInEmail] = useState('ananya.s@example.com');
  const [signInPassword, setSignInPassword] = useState('password123');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up form states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpAddress, setSignUpAddress] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Forgot / Reset Password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Profile Edit states
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Change Password in Profile
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Keep profile inputs synced to logged-in customer
  useEffect(() => {
    if (currentCustomer) {
      setProfileName(currentCustomer.name);
      setProfilePhone(currentCustomer.phone || '');
      setProfileAddress(currentCustomer.address || '');
    }
  }, [currentCustomer]);

  if (!isOpen) return null;

  // Validation helpers
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Quick Demo fill for instant testing
  const handleFillDemoCustomer = () => {
    setSignInEmail('ananya.s@example.com');
    setSignInPassword('password123');
    setErrorMessage('');
  };

  const handleFillDemoRegistration = () => {
    setSignUpName('Rohan Verma');
    setSignUpEmail('rohan.verma@example.com');
    setSignUpPhone('+91 98200 55431');
    setSignUpAddress('42, Palm Meadows, Whitefield, Bengaluru');
    setSignUpPassword('bloom2026');
    setSignUpConfirmPassword('bloom2026');
    setErrorMessage('');
  };

  // 1. Submit Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }
    if (!isValidEmail(signInEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const result = await customerLogin(signInEmail, signInPassword);
    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  // 2. Submit Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      setErrorMessage('Name, email, and password are required.');
      return;
    }
    if (!isValidEmail(signUpEmail)) {
      setErrorMessage('Please enter a valid email format.');
      return;
    }
    if (signUpPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const result = await customerSignUp({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      phone: signUpPhone.trim() || '+91 98450 00000',
      address: signUpAddress.trim() || 'Indiranagar, Bengaluru',
      password: signUpPassword,
    });
    setIsLoading(false);

    if (result.success) {
      onClose();
    } else {
      setErrorMessage(result.error || 'Could not create account.');
    }
  };

  // 3. Submit Forgot Password
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail || !isValidEmail(forgotEmail)) {
      setErrorMessage('Please enter your valid registered email address.');
      return;
    }

    setIsLoading(true);
    const result = await customerForgotPassword(forgotEmail);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage(
        `Reset code generated! Use code: ${result.resetCode || '582914'} to set a new password.`
      );
      if (result.resetCode) {
        setResetCode(result.resetCode);
      }
      setTimeout(() => {
        setActiveView('reset');
      }, 1500);
    } else {
      setErrorMessage(result.error || 'Unable to process reset request.');
    }
  };

  // 4. Submit Reset Password
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail) {
      setErrorMessage('Email address is missing. Please go back to step 1.');
      return;
    }
    if (!resetCode.trim()) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await customerResetPassword(forgotEmail, resetCode, newPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccessMessage('Password successfully updated! Please sign in with your new password.');
      setSignInEmail(forgotEmail);
      setSignInPassword('');
      setTimeout(() => {
        setActiveView('signin');
      }, 1200);
    } else {
      setErrorMessage(result.error || 'Password reset failed.');
    }
  };

  // 5. Submit Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!profileName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    setIsLoading(true);
    const res = await updateCustomerProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
      address: profileAddress.trim(),
    });
    setIsLoading(false);

    if (res.success) {
      setIsEditingProfile(false);
      setSuccessMessage('Profile saved successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setErrorMessage(res.error || 'Failed to save changes.');
    }
  };

  // 6. Submit Change Password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPasswordInput || !newPasswordInput) {
      setErrorMessage('Please fill out all password fields.');
      return;
    }
    if (newPasswordInput.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    setIsLoading(true);
    const res = await changeCustomerPassword(currentPasswordInput, newPasswordInput);
    setIsLoading(false);

    if (res.success) {
      setIsChangingPassword(false);
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
      setSuccessMessage('Password changed securely.');
      setTimeout(() => setSuccessMessage(''), 3500);
    } else {
      setErrorMessage(res.error || 'Could not change password.');
    }
  };

  return (
    <div
      id="customer-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full border border-[#DFD8CB] shadow-2xl overflow-hidden relative animate-in zoom-in-95 max-h-[92vh] flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-[#1A3828] text-white p-5 sm:p-6 relative shrink-0">
          <button
            id="close-customer-auth-modal"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EFE7] text-[#1A3828] flex items-center justify-center font-serif font-bold text-xl shadow-xs">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
                  {activeView === 'profile'
                    ? 'Customer Account & Profile'
                    : activeView === 'signup'
                    ? 'Join Bloom Club'
                    : activeView === 'forgot' || activeView === 'reset'
                    ? 'Account Recovery'
                    : 'Customer Sign In'}
                </h3>
                <span className="bg-[#A7F3D0]/20 text-[#A7F3D0] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Root & Bloom
                </span>
              </div>
              <p className="text-xs text-[#A7F3D0]/80 mt-0.5">
                {activeView === 'profile'
                  ? 'Manage your personal preferences, orders & garden club tier'
                  : activeView === 'signup'
                  ? 'Create an account for 35-min deliveries & plant care perks'
                  : 'Log in to track eco-cargo deliveries and manage service visits'}
              </p>
            </div>
          </div>

          {/* Navigation Pill for Unauthenticated Views */}
          {!currentCustomer && activeView !== 'forgot' && activeView !== 'reset' && (
            <div className="mt-4 flex bg-white/10 p-1 rounded-xl border border-white/10">
              <button
                id="tab-customer-signin"
                onClick={() => {
                  setActiveView('signin');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'signin'
                    ? 'bg-white text-[#1A3828] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                id="tab-customer-signup"
                onClick={() => {
                  setActiveView('signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeView === 'signup'
                    ? 'bg-white text-[#1A3828] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="font-medium">{successMessage}</div>
            </div>
          )}

          {/* VIEW 1: SIGN IN */}
          {activeView === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-3" />
                  <input
                    id="signin-email-input"
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(signInEmail);
                      setActiveView('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-xs font-semibold text-[#D27D46] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-3" />
                  <input
                    id="signin-password-input"
                    type={showSignInPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:outline-hidden focus:ring-2 focus:ring-[#1A3828]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-2.5 text-[#7B9284] hover:text-[#1A3828]"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#486353]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D5CDBC] text-[#1A3828] focus:ring-[#1A3828]"
                  />
                  <span>Remember my session</span>
                </label>

                {/* Demo autofill */}
                <button
                  type="button"
                  onClick={handleFillDemoCustomer}
                  className="text-[11px] text-[#2A5C43] hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#D27D46]" />
                  <span>Use Demo Customer</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  id="customer-signin-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A3828] hover:bg-[#12281D] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-[#1A3828]/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70"
                >
                  {isLoading ? (
                    <span>Signing in securely...</span>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-xs text-[#5D7768]">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('signup');
                      setErrorMessage('');
                    }}
                    className="text-[#1A3828] font-bold hover:underline"
                  >
                    Create one now (Get 100 Bloom Points)
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* VIEW 2: SIGN UP */}
          {activeView === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Rohan Verma"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                    <input
                      id="signup-email-input"
                      type="email"
                      required
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                    Phone (for Delivery SMS)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                    <input
                      id="signup-phone-input"
                      type="tel"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                  Primary Delivery / Garden Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                  <input
                    id="signup-address-input"
                    type="text"
                    value={signUpAddress}
                    onChange={(e) => setSignUpAddress(e.target.value)}
                    placeholder="Apartment, Street, Area, City"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                    <input
                      id="signup-password-input"
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-9 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-2.5 top-2.5 text-[#7B9284]"
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                    <input
                      id="signup-confirmpassword-input"
                      type={showSignUpPassword ? 'text' : 'password'}
                      required
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleFillDemoRegistration}
                  className="text-[11px] text-[#2A5C43] hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#D27D46]" />
                  <span>Autofill Sample User</span>
                </button>
                <span className="text-[10px] text-[#7B9284]">🔒 SSL 256-bit encrypted</span>
              </div>

              <div className="pt-2">
                <button
                  id="customer-signup-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A3828] hover:bg-[#12281D] text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-[#1A3828]/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-70"
                >
                  {isLoading ? <span>Creating account...</span> : <span>Create Customer Account</span>}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-[#5D7768]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('signin');
                      setErrorMessage('');
                    }}
                    className="text-[#1A3828] font-bold hover:underline"
                  >
                    Sign In instead
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* VIEW 3: FORGOT PASSWORD */}
          {activeView === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#EFECE4] border border-[#D5CDBC] text-xs text-[#2F4939] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#142E20]">
                  <KeyRound className="w-4 h-4 text-[#D27D46]" />
                  <span>Password Reset Request</span>
                </div>
                <p>
                  Enter the email address registered with your Root & Bloom account. We'll generate a
                  verification code to verify your identity.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-3" />
                  <input
                    id="forgot-email-input"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs font-bold text-[#3E5647] hover:bg-[#F2ECE1]"
                >
                  Back to Sign In
                </button>
                <button
                  id="forgot-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1A3828] hover:bg-[#12281D] text-white py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? <span>Generating code...</span> : <span>Send Reset Code</span>}
                </button>
              </div>
            </form>
          )}

          {/* VIEW 4: RESET PASSWORD */}
          {activeView === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  Verification code has been dispatched. Enter the 6-digit code below along with your
                  new password.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  id="reset-code-input"
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  placeholder="e.g. 582914"
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDBC] bg-white font-mono text-sm tracking-widest text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                  <input
                    id="new-password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-9 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2.5 top-2.5 text-[#7B9284]"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E5647] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7B9284] absolute left-3.5 top-2.5" />
                  <input
                    id="confirm-new-password-input"
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-[#D5CDBC] bg-white text-xs text-[#142E20] focus:ring-2 focus:ring-[#1A3828]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('signin')}
                  className="px-4 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs font-bold text-[#3E5647]"
                >
                  Cancel
                </button>
                <button
                  id="reset-password-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#1A3828] hover:bg-[#12281D] text-white py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading ? <span>Updating...</span> : <span>Confirm New Password</span>}
                </button>
              </div>
            </form>
          )}

          {/* VIEW 5: CUSTOMER PROFILE & ACCOUNT MANAGEMENT */}
          {activeView === 'profile' && currentCustomer && (
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#DFD8CB] shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1A3828] text-[#8FE388] font-bold text-lg flex items-center justify-center">
                    {currentCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#142E20] flex items-center gap-2">
                      {currentCustomer.name}
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Active" />
                    </h4>
                    <p className="text-xs text-[#637C6D]">{currentCustomer.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D27D46] bg-[#F7EFE8] px-2 py-0.5 rounded-full">
                        <Award className="w-3 h-3" />
                        {currentCustomer.membershipTier || 'Bloom Club Member'}
                      </span>
                      <span className="text-[11px] text-[#4A6454] font-medium">
                        ✨ {currentCustomer.loyaltyPoints || 450} Bloom Points
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-xl border border-[#DFD8CB] text-center">
                  <span className="text-[10px] text-[#698273] font-bold uppercase tracking-wider block">
                    Orders
                  </span>
                  <span className="font-serif font-bold text-lg text-[#142E20]">
                    {orders.length}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#DFD8CB] text-center">
                  <span className="text-[10px] text-[#698273] font-bold uppercase tracking-wider block">
                    Service Visits
                  </span>
                  <span className="font-serif font-bold text-lg text-[#142E20]">
                    {bookings.length}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#DFD8CB] text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#698273] font-bold uppercase tracking-wider block">
                    Fast Delivery
                  </span>
                  <span className="font-bold text-xs text-[#2A5C43] block mt-1">
                    ⚡ 35 Mins Active
                  </span>
                </div>
              </div>

              {/* Edit Details Section */}
              <div className="bg-white p-4 rounded-2xl border border-[#DFD8CB] space-y-3">
                <div className="flex items-center justify-between border-b border-[#EFECE4] pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#3A5343]">
                    Delivery Address & Contact
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-xs font-semibold text-[#D27D46] hover:underline"
                  >
                    {isEditingProfile ? 'Cancel Edit' : 'Edit Details'}
                  </button>
                </div>

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4F6858] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4F6858] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4F6858] mb-1">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 rounded-xl bg-[#1A3828] text-white text-xs font-bold shadow-xs hover:bg-[#12281D]"
                    >
                      {isLoading ? 'Saving...' : 'Update Information'}
                    </button>
                  </form>
                ) : (
                  <div className="text-xs space-y-1.5 text-[#304B3B]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#7B9284]" />
                      <span>{currentCustomer.phone || 'No phone number provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#7B9284]" />
                      <span>{currentCustomer.address || 'Indiranagar, Bengaluru - 560038'}</span>
                    </div>
                    <div className="text-[11px] text-[#7B9284] pt-1">
                      Member Since: {currentCustomer.joinedDate || 'August 2026'}
                    </div>
                  </div>
                )}
              </div>

              {/* Change Password Collapsible */}
              <div className="bg-white p-4 rounded-2xl border border-[#DFD8CB]">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#3A5343]"
                >
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#D27D46]" />
                    Change Account Password
                  </span>
                  <span className="text-[#D27D46] font-semibold text-xs">
                    {isChangingPassword ? 'Hide' : 'Update'}
                  </span>
                </button>

                {isChangingPassword && (
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-2.5 pt-3 mt-2 border-t border-[#EFECE4]">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4F6858] mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={currentPasswordInput}
                        onChange={(e) => setCurrentPasswordInput(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4F6858] mb-1">
                        New Password (min 6 chars)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#4F6858] mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmNewPasswordInput}
                        onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#D5CDBC] bg-[#FAF8F5]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2 rounded-xl bg-[#2A5C43] text-white text-xs font-bold hover:bg-[#1E4431]"
                    >
                      {isLoading ? 'Updating...' : 'Save New Password'}
                    </button>
                  </form>
                )}
              </div>

              {/* Direct Shortcuts to My Garden & Services */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPage('my-garden');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DFD8CB] hover:bg-[#F2ECE1] text-[11px] font-semibold text-[#1A3828] flex items-center justify-center gap-1.5"
                >
                  <Package className="w-3.5 h-3.5 text-[#2A5C43]" />
                  <span>My Garden & Orders</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPage('services');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DFD8CB] hover:bg-[#F2ECE1] text-[11px] font-semibold text-[#1A3828] flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#2A5C43]" />
                  <span>Book Gardening Visit</span>
                </button>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-[#DFD8CB]">
                <button
                  id="customer-logout-btn"
                  type="button"
                  onClick={customerLogout}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
