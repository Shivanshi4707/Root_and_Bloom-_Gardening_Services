import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface UPIPaymentModalProps {
  amount: number;
  customerName: string;
  onSuccess: (details: { txnId: string; upiId: string; appName: string }) => void;
  onCancel: () => void;
}

type UPIApp = 'gpay' | 'phonepe' | 'paytm' | 'bhim';

const POPULAR_APPS: { id: UPIApp; name: string; icon: string; color: string; bg: string }[] = [
  { id: 'gpay', name: 'Google Pay', icon: '⚡', color: '#1A73E8', bg: '#E8F0FE' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: '#5F259F', bg: '#F3E8FF' },
  { id: 'paytm', name: 'Paytm UPI', icon: '🔵', color: '#00BAF2', bg: '#E1F8FF' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: '#004F9F', bg: '#E6EFF9' },
];

const VPA_SUFFIXES = ['@okhdfcbank', '@okaxis', '@okicici', '@oksbi', '@ybl', '@paytm'];

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  amount,
  customerName,
  onSuccess,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'qr'>('apps');
  const [selectedApp, setSelectedApp] = useState<UPIApp>('gpay');
  const [vpaId, setVpaId] = useState('');
  const [paymentState, setPaymentState] = useState<'initial' | 'processing' | 'success'>('initial');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [txnId, setTxnId] = useState('');

  // Generate a realistic transaction reference ID
  useEffect(() => {
    const randomRef = 'UPI' + Math.floor(100000000000 + Math.random() * 900000000000);
    setTxnId(randomRef);
  }, []);

  // 5 minute countdown timer for dynamic QR
  useEffect(() => {
    if (paymentState !== 'initial') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentState]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const merchantVpa = 'rootandbloom@icici';

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleInitiatePayment = (appName?: string) => {
    const app = appName || POPULAR_APPS.find((a) => a.id === selectedApp)?.name || 'Google Pay';
    setPaymentState('processing');

    // Simulate realistic bank UPI push notification & approval flow
    setTimeout(() => {
      setPaymentState('success');
      setTimeout(() => {
        onSuccess({
          txnId,
          upiId: vpaId || `${customerName.toLowerCase().replace(/\s+/g, '')}@okaxis`,
          appName: app,
        });
      }, 1800);
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border border-[#DFD8CB] shadow-2xl overflow-hidden relative flex flex-col animate-in zoom-in-95">
        
        {/* UPI Header Strip */}
        <div className="bg-[#1A3828] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg text-[#8FE388]">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base">Unified Payments Interface</h3>
                <span className="text-[10px] bg-[#8FE388]/20 text-[#8FE388] px-1.5 py-0.5 rounded-sm font-semibold">
                  NPCI
                </span>
              </div>
              <p className="text-[11px] text-white/70">
                Root & Bloom Botanicals • Verified Merchant
              </p>
            </div>
          </div>
          {paymentState === 'initial' && (
            <button
              onClick={onCancel}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Cancel payment"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Amount Banner */}
        <div className="bg-[#FAF8F5] px-6 py-3.5 border-b border-[#EAE4D7] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#607769] block font-medium">Paying Amount</span>
            <span className="font-serif font-bold text-2xl text-[#142E20]">₹{amount}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#607769] block">Order Ref ID</span>
            <span className="text-xs font-mono font-bold text-[#142E20]">{txnId.slice(0, 12)}</span>
          </div>
        </div>

        {/* Body Content based on Payment State */}
        <div className="p-6">
          {paymentState === 'initial' && (
            <div className="space-y-5">
              {/* Tab Selector: UPI Apps vs Dynamic QR */}
              <div className="grid grid-cols-2 p-1 bg-[#F2ECE1] rounded-2xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('apps')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'apps'
                      ? 'bg-white text-[#1A3828] shadow-xs'
                      : 'text-[#627A6C] hover:text-[#1A3828]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI Apps & ID</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'qr'
                      ? 'bg-white text-[#1A3828] shadow-xs'
                      : 'text-[#627A6C] hover:text-[#1A3828]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR Code</span>
                </button>
              </div>

              {activeTab === 'apps' ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2A5C43] block mb-2.5">
                      Pay via Installed UPI App
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {POPULAR_APPS.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => {
                            setSelectedApp(app.id);
                            handleInitiatePayment(app.name);
                          }}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all hover:border-[#1A3828] hover:shadow-xs active:scale-97 ${
                            selectedApp === app.id
                              ? 'border-[#1A3828] bg-[#F7FAF8]'
                              : 'border-[#DFD8CB] bg-white'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 font-bold"
                            style={{ backgroundColor: app.bg, color: app.color }}
                          >
                            {app.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#142E20] block">{app.name}</span>
                            <span className="text-[10px] text-[#698273]">Instant Pay</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E5DFD3]"></div>
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase">
                      <span className="bg-white px-3 text-[#7B9284] font-bold">Or Enter UPI ID</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. mobile@upi or name@okhdfcbank"
                        value={vpaId}
                        onChange={(e) => setVpaId(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D5CDBC] bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#2A5C43]"
                      />
                      <button
                        type="button"
                        onClick={() => handleInitiatePayment('Custom UPI')}
                        disabled={!vpaId.includes('@')}
                        className="px-4 py-2.5 rounded-xl bg-[#1A3828] hover:bg-[#12281D] text-white text-xs font-bold disabled:opacity-40 transition-all"
                      >
                        Verify & Pay
                      </button>
                    </div>

                    {/* VPA quick suffixes */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {VPA_SUFFIXES.map((suffix) => (
                        <button
                          key={suffix}
                          type="button"
                          onClick={() => {
                            const prefix = vpaId.split('@')[0] || customerName.toLowerCase().replace(/\s+/g, '');
                            setVpaId(prefix + suffix);
                          }}
                          className="px-2 py-0.5 rounded-md bg-[#F2ECE1] text-[10px] font-semibold text-[#1A3828] hover:bg-[#E2D9CB]"
                        >
                          {suffix}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Dynamic QR Code View */
                <div className="space-y-4 text-center">
                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#DFD8CB] inline-block mx-auto shadow-inner">
                    {/* High fidelity simulated dynamic QR */}
                    <div className="relative w-48 h-48 bg-white p-2.5 rounded-xl border-2 border-[#1A3828] mx-auto flex flex-col items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* QR Matrix Elements */}
                        <rect x="0" y="0" width="100" height="100" fill="#FFFFFF" />
                        {/* Position markers Top-Left */}
                        <rect x="5" y="5" width="26" height="26" fill="#142E20" rx="4" />
                        <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="13" y="13" width="10" height="10" fill="#142E20" rx="1" />

                        {/* Position markers Top-Right */}
                        <rect x="69" y="5" width="26" height="26" fill="#142E20" rx="4" />
                        <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="77" y="13" width="10" height="10" fill="#142E20" rx="1" />

                        {/* Position markers Bottom-Left */}
                        <rect x="5" y="69" width="26" height="26" fill="#142E20" rx="4" />
                        <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" rx="2" />
                        <rect x="13" y="77" width="10" height="10" fill="#142E20" rx="1" />

                        {/* Data dots */}
                        <rect x="36" y="8" width="5" height="5" fill="#142E20" />
                        <rect x="46" y="8" width="5" height="5" fill="#142E20" />
                        <rect x="56" y="8" width="5" height="5" fill="#142E20" />
                        <rect x="36" y="18" width="5" height="5" fill="#142E20" />
                        <rect x="46" y="18" width="10" height="5" fill="#142E20" />
                        <rect x="8" y="36" width="5" height="10" fill="#142E20" />
                        <rect x="18" y="36" width="8" height="5" fill="#142E20" />
                        <rect x="8" y="52" width="18" height="5" fill="#142E20" />
                        <rect x="36" y="36" width="28" height="28" fill="#142E20" rx="4" />
                        {/* Center Brand Badge */}
                        <rect x="40" y="40" width="20" height="20" fill="#FFFFFF" rx="3" />
                        <text x="50" y="54" fontSize="11" textAnchor="middle" fill="#1A3828" fontWeight="bold">🌱</text>

                        <rect x="68" y="36" width="10" height="8" fill="#142E20" />
                        <rect x="82" y="36" width="12" height="5" fill="#142E20" />
                        <rect x="72" y="50" width="15" height="8" fill="#142E20" />
                        <rect x="40" y="72" width="12" height="6" fill="#142E20" />
                        <rect x="56" y="72" width="8" height="18" fill="#142E20" />
                        <rect x="70" y="70" width="24" height="24" fill="#142E20" rx="2" />
                      </svg>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-2 text-[11px] text-[#2A5C43] font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>QR Expires in {formatTimer(timeLeft)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className="text-[#607769]">VPA:</span>
                    <code className="bg-[#F2ECE1] px-2 py-0.5 rounded-md font-mono text-[#142E20] font-bold">
                      {merchantVpa}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyVpa}
                      className="p-1 text-[#2A5C43] hover:text-[#142E20]"
                      title="Copy VPA"
                    >
                      {copiedVpa ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-[#698273]">
                    Scan using any UPI app: Google Pay, PhonePe, Paytm, BHIM, or CRED.
                  </p>

                  <button
                    type="button"
                    onClick={() => handleInitiatePayment('QR Code Scan')}
                    className="w-full bg-[#1A3828] hover:bg-[#12281D] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Simulate Payment Approval</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {paymentState === 'processing' && (
            <div className="py-8 text-center space-y-4 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#DFD8CB]"></div>
                <div className="absolute inset-0 rounded-full border-4 border-[#1A3828] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-[#1A3828]">
                  ₹
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-serif font-bold text-xl text-[#142E20]">
                  Awaiting UPI Approval
                </h4>
                <p className="text-xs text-[#526B5C] max-w-xs mx-auto leading-relaxed">
                  Please open your UPI app on your mobile device and approve the payment of{' '}
                  <strong className="text-[#142E20]">₹{amount}</strong> for Root & Bloom.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#DFD8CB] text-xs text-[#526B5C] flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2A5C43]" />
                <span>Do not press Back or close this window</span>
              </div>
            </div>
          )}

          {paymentState === 'success' && (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-[#E5EFE7] text-[#2A5C43] flex items-center justify-center mx-auto text-4xl shadow-sm">
                ✓
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#2A5C43] uppercase tracking-wider block">
                  Payment Received
                </span>
                <h4 className="font-serif font-bold text-2xl text-[#142E20]">
                  ₹{amount} Paid Successfully
                </h4>
                <p className="text-xs text-[#526B5C]">
                  Confirmed by ICICI UPI Gateway • Ref: {txnId}
                </p>
              </div>

              <div className="text-xs text-[#698273]">
                Returning to your order confirmation...
              </div>
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="mt-5 pt-3 border-t border-[#EFE9DC] flex items-center justify-center gap-2 text-[10px] text-[#718779]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2A5C43]" />
            <span>256-bit NPCI Certified Gateway • Root & Bloom Garden Co.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
