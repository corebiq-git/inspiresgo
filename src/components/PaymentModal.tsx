import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  Copy, 
  Check, 
  Smartphone, 
  Sparkles,
  Calendar,
  Users,
  MapPin,
  AlertCircle
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { 
    isPaymentModalOpen, 
    setIsPaymentModalOpen, 
    activeBookingRequest, 
    completeBooking,
    formatPrice,
    user
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'apple_pay'>('upi');
  
  // UPI State
  const [upiVpa, setUpiVpa] = useState('kathryn@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8920 1928 4091');
  const [cardHolder, setCardHolder] = useState(user.fullName || 'Fathima');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('883');
  const [saveCard, setSaveCard] = useState(true);

  // Loyalty Points Discount
  const [usePoints, setUsePoints] = useState(false);
  const pointsDiscountUSD = 48.50;

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<'idle' | 'authorizing' | 'otp' | 'success'>('idle');
  const [completedBookingRef, setCompletedBookingRef] = useState<string | null>(null);

  if (!isPaymentModalOpen || !activeBookingRequest) return null;

  const totalBeforeDiscount = activeBookingRequest.totalAmountUSD;
  const finalTotal = usePoints ? Math.max(10, totalBeforeDiscount - pointsDiscountUSD) : totalBeforeDiscount;

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(upiVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setProcessStep('authorizing');

    // Simulate 3-stage payment gateway authorization
    setTimeout(() => {
      setProcessStep('otp');
      setTimeout(async () => {
        setProcessStep('success');
        const booking = await completeBooking(paymentMethod === 'upi' ? 'UPI Instant Pay' : 'Credit Card (Visa)');
        setCompletedBookingRef(booking.bookingRef);
        setIsProcessing(false);
      }, 1200);
    }, 1200);
  };

  const handleClose = () => {
    setIsPaymentModalOpen(false);
    setProcessStep('idle');
    setCompletedBookingRef(null);
  };

  return (
    <div id="payment-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div 
        id="payment-modal-card"
        className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-sky-100 flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="bg-[#051b34] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
                Secure Checkout
              </div>
              <div className="text-sm font-black">
                InspireGO Payment Gateway
              </div>
            </div>
          </div>

          <button
            id="close-payment-modal-btn"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* If Payment is Confirmed */}
          {processStep === 'success' ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Payment Confirmed & Verified
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  You're Ready for the Journey!
                </h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your booking voucher and e-ticket have been generated and sent to {user.email}.
                </p>
              </div>

              {/* Digital E-Ticket Card */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Booking Reference</div>
                    <div className="text-lg font-black text-[#051b34]">{completedBookingRef || 'BK-849201'}</div>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-800" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Package / Trip</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{activeBookingRequest.title}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Travel Dates</span>
                    <span className="font-bold text-slate-800">{activeBookingRequest.startDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Traveler(s)</span>
                    <span className="font-bold text-slate-800">{activeBookingRequest.travelersCount} Guests</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Paid</span>
                    <span className="font-black text-emerald-700">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 max-w-md mx-auto">
                <button
                  onClick={() => alert(`Digital E-Ticket ${completedBookingRef} downloaded!`)}
                  className="flex-1 py-3 rounded-2xl bg-[#051b34] hover:bg-sky-950 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download E-Ticket PDF
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Order Summary Pill */}
              <div className="bg-sky-50/70 rounded-2xl p-4 border border-sky-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                      Trip Order Summary
                    </div>
                    <div className="text-sm font-black text-slate-900 line-clamp-1">
                      {activeBookingRequest.title}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sky-600" /> {activeBookingRequest.destination}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-sky-600" /> {activeBookingRequest.travelersCount} Travelers
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">Total Due</div>
                    <div className="text-lg font-black text-sky-800">
                      {formatPrice(finalTotal)}
                    </div>
                  </div>
                </div>

                {/* Loyalty points toggle */}
                <div className="pt-2 border-t border-sky-200/60 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usePoints}
                      onChange={(e) => setUsePoints(e.target.checked)}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-slate-700 font-medium">
                      Redeem 4,850 InspireGO Points (Save {formatPrice(pointsDiscountUSD)})
                    </span>
                  </label>
                  <span className="font-bold text-amber-600 text-[11px]">★ Gold Perk</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    id="pay-tab-upi"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'upi'
                        ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/30 text-sky-900 font-black'
                        : 'bg-white border-slate-200 text-slate-600 font-bold hover:border-slate-300'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-sky-700" />
                    <span className="text-xs">UPI QR / VPA</span>
                  </button>

                  <button
                    type="button"
                    id="pay-tab-card"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'card'
                        ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/30 text-sky-900 font-black'
                        : 'bg-white border-slate-200 text-slate-600 font-bold hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-sky-700" />
                    <span className="text-xs">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    id="pay-tab-applepay"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === 'apple_pay'
                        ? 'bg-sky-50 border-sky-600 ring-2 ring-sky-600/30 text-sky-900 font-black'
                        : 'bg-white border-slate-200 text-slate-600 font-bold hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-sky-700" />
                    <span className="text-xs">Digital Wallet</span>
                  </button>
                </div>
              </div>

              {/* TAB 1: UPI PAYMENT FORM */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase">
                        Instant UPI Payment
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Scan QR code with any UPI app or enter your Virtual Payment Address (VPA).
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Zero Surcharge
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shadow-inner flex-shrink-0">
                      <QrCode className="w-24 h-24 text-slate-900" />
                    </div>
                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="text-xs font-bold text-slate-800">
                        Scan with Google Pay, PhonePe, Paytm or BHIM
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Camera or UPI scanner recognizes transaction ID and amount {formatPrice(finalTotal)} instantly.
                      </div>
                      <div className="inline-block text-[10px] font-mono font-bold bg-sky-50 text-sky-900 px-2 py-1 rounded border border-sky-100">
                        merchant@inspirego.upi
                      </div>
                    </div>
                  </div>

                  {/* VPA Input Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Or enter UPI ID / VPA
                    </label>
                    <div className="relative flex">
                      <input
                        type="text"
                        value={upiVpa}
                        onChange={(e) => setUpiVpa(e.target.value)}
                        placeholder="fathima@okhdfcbank"
                        className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2.5 pr-20 focus:outline-none focus:ring-1 focus:ring-sky-600"
                      />
                      <button
                        type="button"
                        onClick={handleCopyVpa}
                        className="absolute right-2 top-2 px-2.5 py-1 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all flex items-center gap-1"
                      >
                        {copiedVpa ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedVpa ? 'Copied' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  {/* Quick Select Popular UPI Apps */}
                  <div className="flex gap-2">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                      <span key={app} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARD */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {/* Visual 3D Credit Card Simulation */}
                  <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-[#051b34] via-[#08284d] to-sky-900 text-white p-5 shadow-xl flex flex-col justify-between relative overflow-hidden border border-sky-500/30">
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-xs font-black tracking-widest text-sky-300">InspireGO Travel Card</span>
                      <span className="text-xs font-black italic tracking-wider bg-white/10 px-2 py-0.5 rounded backdrop-blur-md">
                        VISA
                      </span>
                    </div>

                    <div className="relative z-10 font-mono text-base sm:text-lg tracking-widest font-black text-white/90">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex items-center justify-between relative z-10 text-xs">
                      <div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Cardholder</div>
                        <div className="font-bold tracking-wide uppercase">{cardHolder || 'CARDHOLDER NAME'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">Expires</div>
                        <div className="font-bold tracking-wide">{expiry || 'MM/YY'}</div>
                      </div>
                    </div>

                    {/* Subtle aesthetic watermarks */}
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                  </div>

                  {/* Card Input Form */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 8920 1928 4091"
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-600 font-mono"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Fathima"
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-600"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-sky-600 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DIGITAL WALLET */}
              {paymentMethod === 'apple_pay' && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-3">
                  <Smartphone className="w-10 h-10 text-slate-700 mx-auto" />
                  <div className="text-sm font-bold text-slate-900">
                    Pay with Apple Pay or Google Wallet
                  </div>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Authenticate securely with FaceID, TouchID, or your fingerprint scanner.
                  </p>
                </div>
              )}

              {/* Security Seal */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-2">
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-sky-600" /> 256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span className="font-semibold">PCI-DSS Level 1</span>
                <span>•</span>
                <span className="font-semibold">100% Refund Guarantee</span>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="submit-payment-btn"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-[#051b34] hover:bg-sky-950 active:scale-98 text-white font-black text-sm shadow-md flex items-center justify-between transition-all"
                >
                  <div className="w-6" />
                  <span>
                    {isProcessing 
                      ? (processStep === 'authorizing' ? 'Connecting to Bank Gateway...' : 'Verifying 3D Secure OTP...')
                      : `Pay ${formatPrice(finalTotal)} via ${paymentMethod.toUpperCase()}`}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
