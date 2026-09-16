import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EVISA_OPTIONS } from '../data/mockData';
import { 
  FileCheck2, 
  Upload, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  AlertCircle,
  FileText,
  Download,
  CreditCard,
  QrCode
} from 'lucide-react';
import { EVisaOption, VisaApplicationRecord } from '../types';

export const EVisaView: React.FC = () => {
  const { user, submitVisaApplication, visaApplications, formatPrice, startBookingFlow } = useApp();
  const [activeTab, setActiveTab] = useState<'apply' | 'track' | 'requirements'>('apply');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('visa-saudi');
  
  // Application Form State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [applicantName, setApplicantName] = useState(user.fullName || 'Fathima');
  const [passportNumber, setPassportNumber] = useState(user.passportNumber || 'IND78492019');
  const [nationality, setNationality] = useState(user.nationality || 'India');
  const [email, setEmail] = useState(user.email || 'fathima@inspirego.travel');
  const [passportUploaded, setPassportUploaded] = useState(true);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedVisa, setSubmittedVisa] = useState<VisaApplicationRecord | null>(null);

  // Tracking query state
  const [trackRefQuery, setTrackRefQuery] = useState('EV-SA-849204');
  const [searchedRecord, setSearchedRecord] = useState<VisaApplicationRecord | null>(
    visaApplications[0] || null
  );

  const selectedCountry = EVISA_OPTIONS.find(c => c.id === selectedCountryId) || EVISA_OPTIONS[0];

  const handleApplyNext = async () => {
    if (step === 1) {
      if (!applicantName || !passportNumber) {
        alert('Please fill out all applicant and passport information');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Trigger payment and application submission
      setIsSubmitting(true);
      try {
        const created = await submitVisaApplication({
          country: selectedCountry.country,
          applicantName,
          passportNumber,
          nationality,
          email,
          visaType: `${selectedCountry.validity} ${selectedCountry.entries} Entry eVisa`,
          feeUSD: selectedCountry.feeUSD
        });
        setSubmittedVisa(created);
        setSearchedRecord(created);
        setTrackRefQuery(created.referenceNo);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSearchRef = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = trackRefQuery.trim().toUpperCase();
    const found = visaApplications.find(v => 
      v.referenceNo.toUpperCase().includes(cleanQuery) ||
      v.id.toUpperCase().includes(cleanQuery) ||
      v.passportNumber.toUpperCase().includes(cleanQuery)
    );
    if (found) {
      setSearchedRecord(found);
    } else {
      // Simulated dynamic result
      setSearchedRecord({
        id: `VISA-${Math.floor(1000 + Math.random() * 9000)}`,
        userId: user.userId,
        country: selectedCountry.country,
        applicantName,
        passportNumber,
        nationality,
        email,
        visaType: 'Official Tourist Electronic Visa',
        status: 'under_review',
        referenceNo: trackRefQuery.toUpperCase(),
        feeUSD: selectedCountry.feeUSD,
        submittedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
          <FileCheck2 className="w-3.5 h-3.5" /> Fast-Track Electronic Visa Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Apply & Track Official E-Visas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Instant government-approved electronic visas for Saudi Arabia, UAE, Schengen, Japan, and the UK with 24-hour turnaround.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-sky-100 shadow-2xs">
        <button
          id="evisa-tab-apply"
          onClick={() => setActiveTab('apply')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'apply'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Apply E-Visa
        </button>
        <button
          id="evisa-tab-track"
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'track'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Track Application
        </button>
        <button
          id="evisa-tab-req"
          onClick={() => setActiveTab('requirements')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'requirements'
              ? 'bg-[#051b34] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Requirements
        </button>
      </div>

      {/* Tab 1: Apply Workflow */}
      {activeTab === 'apply' && (
        <div className="space-y-5">
          {/* Country Carousel */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400">
              Select Destination Country
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {EVISA_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  id={`visa-country-btn-${c.id}`}
                  onClick={() => setSelectedCountryId(c.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    selectedCountryId === c.id
                      ? 'bg-sky-50/90 border-sky-600 ring-2 ring-sky-600/30 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100/60 px-2 py-0.5 rounded-full">
                      {formatPrice(c.feeUSD)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-extrabold text-slate-900 leading-tight">
                      {c.country}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {c.processingTime}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stepper Wizard Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-6">
            {/* Steps Progress */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  step >= 1 ? 'bg-[#051b34] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  1
                </span>
                <span className={`text-xs font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                  Traveler Info
                </span>
              </div>
              <div className="h-0.5 w-8 bg-slate-200" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  step >= 2 ? 'bg-[#051b34] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  2
                </span>
                <span className={`text-xs font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                  Documents
                </span>
              </div>
              <div className="h-0.5 w-8 bg-slate-200" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  step === 3 ? 'bg-[#051b34] text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  3
                </span>
                <span className={`text-xs font-bold ${step === 3 ? 'text-slate-900' : 'text-slate-400'}`}>
                  Payment
                </span>
              </div>
            </div>

            {/* Step 1: Traveler Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#051b34]">
                  Primary Applicant Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Full Legal Name (as on Passport)
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Fathima"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-1 focus:ring-sky-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Passport Number
                    </label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. USA89210943"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-1 focus:ring-sky-600 focus:outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="e.g. India"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-1 focus:ring-sky-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Email Address for Visa Delivery
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. fathima@inspirego.travel"
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-1 focus:ring-sky-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 flex items-start gap-2 text-xs text-sky-900">
                  <ShieldCheck className="w-4 h-4 text-sky-700 flex-shrink-0 mt-0.5" />
                  <span>
                    Your passport must have at least <strong>6 months of remaining validity</strong> from your planned arrival date.
                  </span>
                </div>
              </div>
            )}

            {/* Step 2: Upload Documents */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#051b34]">
                  Required Document Uploads
                </h3>

                {/* Passport Bio Scan */}
                <div className="border-2 border-dashed border-sky-200 rounded-2xl p-4 bg-sky-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#051b34] text-white flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Passport Bio Page (Color)</div>
                      <div className="text-[11px] text-slate-500">PDF, JPG, PNG (Max 10MB)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                  </div>
                </div>

                {/* Passport Photo */}
                <div className="border-2 border-dashed border-sky-200 rounded-2xl p-4 bg-sky-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#051b34] text-white flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Passport Photo (White Background)</div>
                      <div className="text-[11px] text-slate-500">Square dimension, neutral expression</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Fee Review & Submit */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#051b34]">
                  Fee Summary & Payment Method
                </h3>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Destination Country</span>
                    <span className="font-bold text-slate-900">{selectedCountry.country}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Visa Category</span>
                    <span className="font-bold text-slate-900">{selectedCountry.entries} Entry ({selectedCountry.validity})</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Government Fee & Mandatory Health Insurance</span>
                    <span className="font-bold text-slate-900">{formatPrice(selectedCountry.feeUSD - 15)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>InspireGO 24h Express Processing</span>
                    <span className="font-bold text-slate-900">{formatPrice(15)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Total Amount Payable</span>
                    <span className="text-sky-800">{formatPrice(selectedCountry.feeUSD)}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">Instant Approval Guarantee</div>
                      <div className="text-[10px] text-emerald-800">100% refund if rejected by government authorities</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-2xs text-slate-800">UPI</span>
                    <span className="text-xs font-bold bg-white px-2 py-1 rounded shadow-2xs text-slate-800">Card</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {step > 1 ? (
                <button
                  onClick={() => setStep(prev => (prev - 1) as any)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Back
                </button>
              ) : <div />}

              <button
                id="evisa-next-btn"
                onClick={handleApplyNext}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-[#051b34] hover:bg-sky-950 active:scale-95 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-all"
              >
                {step === 3 
                  ? (isSubmitting ? 'Processing Application...' : 'Pay & Submit Application') 
                  : 'Continue to Next Step'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Success Banner when submitted */}
          {submittedVisa && (
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Application Submitted Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Your reference number is <strong>{submittedVisa.referenceNo}</strong>. Track status in the Track tab.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Track Application */}
      {activeTab === 'track' && (
        <div className="space-y-4">
          <form onSubmit={handleSearchRef} className="flex gap-2">
            <input
              type="text"
              value={trackRefQuery}
              onChange={(e) => setTrackRefQuery(e.target.value)}
              placeholder="Enter Application Ref No. (e.g. EV-SA-849204)"
              className="flex-1 bg-white border border-sky-100 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 uppercase shadow-2xs"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-[#051b34] text-white text-xs font-bold shadow-2xs hover:bg-sky-950"
            >
              Track Status
            </button>
          </form>

          {searchedRecord ? (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs text-slate-400">Application Reference</div>
                  <div className="text-base font-black text-[#051b34]">{searchedRecord.referenceNo}</div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                  searchedRecord.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {searchedRecord.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Applicant</span>
                  <span className="font-bold text-slate-800">{searchedRecord.applicantName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Country</span>
                  <span className="font-bold text-slate-800">{searchedRecord.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Passport Number</span>
                  <span className="font-bold text-slate-800">{searchedRecord.passportNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Visa Type</span>
                  <span className="font-bold text-slate-800">{searchedRecord.visaType}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-700">Verification Steps</div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application & biometric scan verified</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Government portal fee payment confirmed</span>
                  </div>
                  <div className={`flex items-center gap-2.5 text-xs ${
                    searchedRecord.status === 'approved' ? 'text-emerald-800' : 'text-slate-400'
                  }`}>
                    <CheckCircle2 className={`w-4 h-4 ${searchedRecord.status === 'approved' ? 'text-emerald-600' : 'text-slate-300'}`} />
                    <span>Electronic Visa Approved & Issued</span>
                  </div>
                </div>
              </div>

              {searchedRecord.status === 'approved' && (
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => alert(`Official E-Visa pass ${searchedRecord.referenceNo} downloaded to your device!`)}
                    className="w-full py-3 rounded-2xl bg-[#051b34] hover:bg-sky-950 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Official E-Visa PDF Pass
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-3xl border border-slate-100">
              No application found with that reference number. Try searching <strong>EV-SA-849204</strong>.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Requirements Directory */}
      {activeTab === 'requirements' && (
        <div className="space-y-3">
          {EVISA_OPTIONS.map((opt) => (
            <div key={opt.id} className="bg-white rounded-2xl p-4 border border-sky-100/70 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{opt.flag}</span>
                  <h3 className="text-sm font-bold text-[#051b34]">{opt.country}</h3>
                </div>
                <span className="text-xs font-extrabold text-sky-800">
                  {formatPrice(opt.feeUSD)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Validity: <strong>{opt.validity}</strong> • Max stay: <strong>{opt.stayDuration}</strong>
              </p>
              <div className="space-y-1 pt-1">
                {opt.documentsRequired.map((doc, i) => (
                  <div key={i} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-sky-600 flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
