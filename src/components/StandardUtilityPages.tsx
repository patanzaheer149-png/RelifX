import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Cookie, 
  RotateCcw, 
  XCircle, 
  KeyRound, 
  MailCheck, 
  ShieldAlert, 
  Wrench, 
  HelpCircle, 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  RefreshCw, 
  Send,
  Lock,
  PhoneCall
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export type UtilityPageType = 
  | '404_not_found'
  | 'privacy_policy'
  | 'terms_conditions'
  | 'cookie_preferences'
  | 'refund_cancellation'
  | 'payment_failed'
  | 'password_reset'
  | 'email_verification'
  | 'access_denied'
  | 'maintenance_mode'
  | 'help_support';

interface StandardUtilityPagesProps {
  pageType: UtilityPageType;
  onBack: () => void;
  onNavigateToPage: (page: UtilityPageType) => void;
}

export const StandardUtilityPages: React.FC<StandardUtilityPagesProps> = ({
  pageType,
  onBack,
  onNavigateToPage,
}) => {
  // State for Cookie Preferences
  const [cookies, setCookies] = useState({
    essential: true, // Always true
    analytics: true,
    functional: true,
    marketing: false,
  });
  const [cookieSaved, setCookieSaved] = useState(false);

  // State for Password Reset
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

  // State for Email OTP Verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);

  // State for Support Ticket
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const renderHeader = (title: string, subtitle?: string) => (
    <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
      <button
        onClick={() => {
          soundManager.playTap();
          onBack();
        }}
        className="w-8 h-8 rounded-lg border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors shadow-2xs"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="text-center flex-1 px-2">
        <h2 className="text-sm font-bold text-neutral-900 truncate">{title}</h2>
        {subtitle && <p className="text-[10px] text-neutral-500 truncate">{subtitle}</p>}
      </div>

      <div className="w-8" />
    </div>
  );

  return (
    <div className="w-full min-h-[750px] bg-white text-neutral-900 flex flex-col justify-between p-6 select-none font-sans relative">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* ======================================================== */}
        {/* 1. 404 NOT FOUND PAGE */}
        {/* ======================================================== */}
        {pageType === '404_not_found' && (
          <div className="text-center py-10 px-4 max-w-sm mx-auto my-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center mx-auto text-2xl font-black font-mono shadow-xs">
              404
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Page Not Found</h2>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                The resource route or coordination record you requested could not be located on the server.
              </p>
            </div>
            <div className="pt-4 space-y-2">
              <button
                onClick={() => {
                  soundManager.playTap();
                  onBack();
                }}
                className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm active:scale-98"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => onNavigateToPage('help_support')}
                className="w-full h-10 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center justify-center transition-colors"
              >
                Contact Emergency Support
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. PRIVACY POLICY PAGE */}
        {/* ======================================================== */}
        {pageType === 'privacy_policy' && (
          <div className="space-y-4">
            {renderHeader('Privacy Policy', 'Last updated: October 2026')}
            <div className="text-xs text-neutral-600 space-y-3 leading-relaxed">
              <p className="font-semibold text-neutral-900">
                1. Disaster Relief Data Protection
              </p>
              <p>
                Our platform coordinates life-saving supplies for emergency zones. We collect field coordinates, emergency contact names, and resource requirement logs strictly to execute logistical dispatches.
              </p>
              <p className="font-semibold text-neutral-900">
                2. Information We Collect
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Operator location data & affected camp coordinates</li>
                <li>Warehouse stock inventory reserves</li>
                <li>Device authentication tokens & convoy radio IDs</li>
              </ul>
              <p className="font-semibold text-neutral-900">
                3. Encryption & Access
              </p>
              <p>
                All data is encrypted in transit using TLS 1.3 and at rest via encrypted database storage.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. TERMS AND CONDITIONS PAGE */}
        {/* ======================================================== */}
        {pageType === 'terms_conditions' && (
          <div className="space-y-4">
            {renderHeader('Terms & Conditions', 'Disaster Relief Coordination')}
            <div className="text-xs text-neutral-600 space-y-3 leading-relaxed">
              <p className="font-semibold text-neutral-900">
                1. Authorized Personnel Usage
              </p>
              <p>
                This platform is designated for verified disaster relief operators, regional warehouse dispatchers, and NGO field coordinators. Unverified reporting of emergency needs is prohibited.
              </p>
              <p className="font-semibold text-neutral-900">
                2. Allocation & Dispatch Accuracy
              </p>
              <p>
                Stock allocations suggested by our greedy allocation engine reflect live warehouse inventory. Priority levels (CRITICAL, HIGH, MEDIUM) dictate priority convoy dispatch.
              </p>
              <p className="font-semibold text-neutral-900">
                3. Limitation of Liability
              </p>
              <p>
                Logistical dispatches are subject to extreme weather and field terrain disruptions.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. COOKIE PREFERENCES PAGE */}
        {/* ======================================================== */}
        {pageType === 'cookie_preferences' && (
          <div className="space-y-4">
            {renderHeader('Cookie Preferences', 'Manage tracking & local cache')}
            <p className="text-xs text-neutral-500 leading-relaxed">
              We use necessary session cookies to maintain your login status, cache offline dispatch records, and sync REST traffic with the coordination server.
            </p>

            <div className="space-y-3 pt-2">
              {/* Essential */}
              <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Strictly Essential</h4>
                  <p className="text-[10px] text-neutral-500">Required for authentication and dispatch security</p>
                </div>
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded">Always Active</span>
              </div>

              {/* Analytics */}
              <div className="p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Resource Analytics</h4>
                  <p className="text-[10px] text-neutral-500">Helps optimize warehouse allocation latency</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCookies(c => ({ ...c, analytics: !c.analytics }))}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${cookies.analytics ? 'bg-neutral-900' : 'bg-neutral-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${cookies.analytics ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Functional */}
              <div className="p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Offline Dispatch Cache</h4>
                  <p className="text-[10px] text-neutral-500">Allows offline queuing when cell towers are down</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCookies(c => ({ ...c, functional: !c.functional }))}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${cookies.functional ? 'bg-neutral-900' : 'bg-neutral-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${cookies.functional ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {cookieSaved ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium">
                ✓ Preferences updated successfully
              </div>
            ) : (
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  setCookieSaved(true);
                  setTimeout(() => setCookieSaved(false), 2500);
                }}
                className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm active:scale-98 mt-4"
              >
                Save Cookie Preferences
              </button>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. REFUND & CANCELLATION POLICY */}
        {/* ======================================================== */}
        {pageType === 'refund_cancellation' && (
          <div className="space-y-4">
            {renderHeader('Refund & Cancellation', 'Donations & Logistics Orders')}
            <div className="text-xs text-neutral-600 space-y-3 leading-relaxed">
              <p className="font-semibold text-neutral-900">
                1. Emergency Donation Allocation
              </p>
              <p>
                Funds contributed toward disaster relief supply procurement (potable water, medical trauma kits, fuel generators) are routed to active supplier purchase orders within 30 minutes of contribution.
              </p>
              <p className="font-semibold text-neutral-900">
                2. Cancellation Window
              </p>
              <p>
                Warehouse dispatch requests can be canceled by relief operators as long as the status remains <strong className="text-neutral-900">SUGGESTED</strong> or <strong className="text-neutral-900">APPROVED</strong>. Once a convoy is marked <strong className="text-neutral-900">IN TRANSIT</strong>, shipment cannot be recalled.
              </p>
              <p className="font-semibold text-neutral-900">
                3. Refund Processing
              </p>
              <p>
                Unallocated financial donations can be refunded within 48 hours by filing a ticket through our Help Center.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. PAYMENT FAILED PAGE */}
        {/* ======================================================== */}
        {pageType === 'payment_failed' && (
          <div className="text-center py-8 px-2 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <XCircle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-base font-bold text-neutral-900">Payment Authorization Failed</h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Your relief fund contribution could not be processed by your banking institution.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-1 font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>Error Code:</span>
                <span className="font-bold text-rose-600">ERR_CARD_DECLINED_042</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Amount:</span>
                <span className="font-bold text-neutral-900">$250.00 USD</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Reason:</span>
                <span className="text-neutral-700">Bank 3D-Secure timeout</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  soundManager.playTap();
                  onBack();
                }}
                className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm active:scale-98"
              >
                Retry Payment Method
              </button>
              <button
                onClick={() => onNavigateToPage('help_support')}
                className="w-full h-10 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center justify-center transition-colors"
              >
                Use Alternative Bank Transfer
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 7. PASSWORD RESET / FORGOT PASSWORD */}
        {/* ======================================================== */}
        {pageType === 'password_reset' && (
          <div className="space-y-4">
            {renderHeader('Reset Password', 'Create a new secure password')}

            {passwordResetSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">Password Changed Successfully</h3>
                <p className="text-xs text-neutral-500">
                  Your credentials have been updated in the database.
                </p>
                <button
                  onClick={() => {
                    soundManager.playTap();
                    onBack();
                  }}
                  className="w-full h-10 rounded-lg bg-neutral-900 text-white text-xs font-semibold mt-4"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newPassword.length < 6 || newPassword !== confirmPassword) return;
                  soundManager.playSuccess();
                  setPasswordResetSuccess(true);
                }}
                className="space-y-3 pt-2"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    New Password (min 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  />
                </div>

                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-rose-500 font-medium">Passwords do not match</p>
                )}

                <button
                  type="submit"
                  disabled={!newPassword || newPassword !== confirmPassword}
                  className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm active:scale-98 disabled:opacity-50 mt-4"
                >
                  Update & Save Password
                </button>
              </form>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 8. EMAIL OTP VERIFICATION */}
        {/* ======================================================== */}
        {pageType === 'email_verification' && (
          <div className="space-y-4">
            {renderHeader('Verify Email', 'Enter the 6-digit code')}

            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <MailCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Check Your Inbox</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                We sent a 6-digit confirmation PIN to <strong className="text-neutral-800">operator@relief.org</strong>
              </p>
            </div>

            {/* 6 Digit Inputs */}
            <div className="flex justify-center gap-2 py-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-bold font-mono bg-white border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                />
              ))}
            </div>

            {otpVerified ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-bold">
                ✓ Account successfully verified!
              </div>
            ) : (
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  setOtpVerified(true);
                  setTimeout(() => onBack(), 1200);
                }}
                className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm active:scale-98"
              >
                Verify & Proceed
              </button>
            )}

            <p className="text-center text-xs text-neutral-400">
              Didn&apos;t receive code?{' '}
              <button
                onClick={() => soundManager.playTap()}
                className="text-neutral-900 font-semibold underline"
              >
                Resend in 42s
              </button>
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 9. 403 ACCESS DENIED */}
        {/* ======================================================== */}
        {pageType === 'access_denied' && (
          <div className="text-center py-10 px-4 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-base font-bold text-neutral-900">403: Access Denied</h2>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                You do not possess the required RBAC clearance level to modify Central Depot Stock Reserves or override dispatch quotas.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 text-left">
              <p className="font-semibold text-neutral-800">Required Role:</p>
              <p className="font-mono text-[11px] text-neutral-500 mt-0.5">ROLE_DISASTER_SUPER_ADMIN</p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  soundManager.playTap();
                  onBack();
                }}
                className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm active:scale-98"
              >
                Return to Safe Dashboard
              </button>
              <button
                onClick={() => onNavigateToPage('help_support')}
                className="w-full h-10 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-medium flex items-center justify-center transition-colors"
              >
                Request Role Upgrade from Command
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 10. MAINTENANCE MODE */}
        {/* ======================================================== */}
        {pageType === 'maintenance_mode' && (
          <div className="text-center py-10 px-4 max-w-sm mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center mx-auto shadow-xs">
              <Wrench className="w-7 h-7 animate-pulse" />
            </div>

            <div>
              <h2 className="text-base font-bold text-neutral-900">Scheduled System Maintenance</h2>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                The database cluster is undergoing scheduled optimization and database index rebalancing.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Downtime Remaining</span>
              <p className="text-xl font-bold font-mono text-neutral-900">00:14:32</p>
              <p className="text-[10px] text-emerald-600 font-medium">All emergency queue dispatches preserved</p>
            </div>

            <button
              onClick={() => {
                soundManager.playTap();
                onBack();
              }}
              className="w-full h-10 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm active:scale-98"
            >
              Refresh Platform Status
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* 11. HELP & SUPPORT */}
        {/* ======================================================== */}
        {pageType === 'help_support' && (
          <div className="space-y-4">
            {renderHeader('Help & Support', 'Emergency logistics help center')}

            {/* Emergency Hotline */}
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <PhoneCall className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <p className="font-bold text-rose-900">24/7 Disaster Hotline</p>
                  <p className="text-[10px] text-rose-600 font-mono">+1 (800) 555-RELIEF</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">Emergency</span>
            </div>

            {/* Quick Support Ticket Form */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-3 shadow-xs">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Submit Support Request
              </h3>

              {ticketSubmitted ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium">
                  ✓ Ticket #RELIEF-8842 created. An engineer is responding.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!supportMessage.trim()) return;
                    soundManager.playSuccess();
                    setTicketSubmitted(true);
                    setSupportMessage('');
                    setTimeout(() => setTicketSubmitted(false), 3000);
                  }}
                  className="space-y-2.5"
                >
                  <textarea
                    rows={3}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe your operational issue or dispatch question..."
                    className="w-full bg-white border border-neutral-200 rounded-lg p-2.5 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900"
                  />
                  <button
                    type="submit"
                    className="w-full h-9 rounded-lg bg-neutral-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-98"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Message to Support</span>
                  </button>
                </form>
              )}
            </div>

            {/* Quick Links to Other Utility Pages */}
            <div className="space-y-1.5 pt-2">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Legal & Compliance Hub</p>
              
              <button
                onClick={() => onNavigateToPage('privacy_policy')}
                className="w-full p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs flex items-center justify-between text-neutral-800 font-medium"
              >
                <span>Privacy Policy</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateToPage('terms_conditions')}
                className="w-full p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs flex items-center justify-between text-neutral-800 font-medium"
              >
                <span>Terms & Conditions</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateToPage('cookie_preferences')}
                className="w-full p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs flex items-center justify-between text-neutral-800 font-medium"
              >
                <span>Cookie Preferences</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateToPage('refund_cancellation')}
                className="w-full p-2.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-xs flex items-center justify-between text-neutral-800 font-medium"
              >
                <span>Refund & Cancellation Policy</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-neutral-300 rounded-full mx-auto mt-2" />
    </div>
  );
};
