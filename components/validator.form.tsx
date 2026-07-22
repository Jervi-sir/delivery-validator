'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface ValidatorFormProps {
  onValidate?: (company: string, field1: string, field2: string) => Promise<boolean> | boolean;
}

export interface InputConfig {
  label: string;
  placeholder: string;
  type?: string;
}

export interface DeliveryCompany {
  id: string;
  name: string;
  badge: string;
  color: string;
  field1?: InputConfig; // Optional if company only needs 1 field like DHD
  field2: InputConfig;
}

const DELIVERY_COMPANIES: DeliveryCompany[] = [
  {
    id: 'dhd',
    name: 'DHD Express',
    badge: 'Ecotrack',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    field2: { label: 'Jeton API (Token)', placeholder: 'Enter your DHD API Jeton...', type: 'text' },
  },
  {
    id: 'omexpress',
    name: 'OM Express',
    badge: 'OM',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    field2: { label: 'Jeton API (Token)', placeholder: 'Enter your OM Express API Jeton...', type: 'text' },
  },
  {
    id: 'yalidine',
    name: 'Yalidine Express',
    badge: 'YAL',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    field1: { label: 'API ID', placeholder: 'Enter your Yalidine API ID...', type: 'text' },
    field2: { label: 'API Token', placeholder: 'Enter your Yalidine API Token...', type: 'text' },
  },
  {
    id: 'guepex',
    name: 'Guepex',
    badge: 'YAL',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    field1: { label: 'API ID', placeholder: 'Enter your Guepex API ID...', type: 'text' },
    field2: { label: 'API Token', placeholder: 'Enter your Guepex API Token...', type: 'text' },
  },
  {
    id: 'zr-express',
    name: 'ZR Express',
    badge: 'ZR',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    field1: { label: 'Tenant ID', placeholder: 'Enter your Tenant ID...', type: 'text' },
    field2: { label: 'Secret Key', placeholder: 'Enter your Secret Key...', type: 'text' },
  },
  {
    id: 'noest',
    name: 'Nord & Ouest (NOEST)',
    badge: 'NOEST',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    field1: { label: 'GUID', placeholder: 'Enter your NOEST GUID...', type: 'text' },
    field2: { label: 'API Token', placeholder: 'Enter your API Token...', type: 'text' },
  },
  {
    id: 'ecom-dz',
    name: 'Ecom DZ Logistics',
    badge: 'ECOM',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
    field1: { label: 'API Key', placeholder: 'Enter your Key...', type: 'text' },
    field2: { label: 'API Token', placeholder: 'Enter your Token...', type: 'text' },
  },
];

export const DeliveryValidatorForm: React.FC<ValidatorFormProps> = ({ onValidate }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [field1Val, setField1Val] = useState('');
  const [field2Val, setField2Val] = useState('');
  const [status, setStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCompany = DELIVERY_COMPANIES.find((c) => c.id === selectedCompanyId);

  // Close custom dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setStatus('idle');
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) {
      setStatus('invalid');
      return;
    }

    const requiresField1 = Boolean(selectedCompany.field1);
    if ((requiresField1 && !field1Val) || !field2Val) {
      setStatus('invalid');
      return;
    }

    setIsLoading(true);
    try {
      let isValid = false;
      if (onValidate) {
        isValid = await onValidate(selectedCompanyId, field1Val, field2Val);
      } else {
        const res = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: selectedCompanyId,
            field1: field1Val,
            field2: field2Val,
          }),
        });
        const data = await res.json();
        isValid = Boolean(data.valid);
      }
      setStatus(isValid ? 'valid' : 'invalid');
    } catch {
      setStatus('invalid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-creme-card border border-creme-border rounded-2xl p-8 sm:p-10 shadow-[0_10px_30px_-10px_rgba(44,40,37,0.07),0_20px_25px_-5px_rgba(44,40,37,0.03)] relative">
      <div className="text-center mb-8 pb-5 border-b border-dashed border-creme-border">
        <p className="text-xs uppercase tracking-[0.15em] text-accent-warm font-semibold mb-2">
          Integration Portal
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink-primary tracking-tight">
          Delivery Validator
        </h1>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* Custom Visual Dropdown */}
        <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
          <label className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Delivery Carrier
          </label>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full px-4 py-3 bg-creme-bg border rounded-lg text-ink-primary text-sm outline-none transition-all duration-200 flex items-center justify-between cursor-pointer ${isOpen
              ? 'border-accent-warm ring-3 ring-accent-warm/15 bg-white'
              : 'border-creme-border hover:border-accent-warm/50'
              }`}
          >
            {selectedCompany ? (
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 text-xs font-bold rounded border ${selectedCompany.color}`}>
                  {selectedCompany.badge}
                </span>
                <span className="font-medium text-ink-primary">{selectedCompany.name}</span>
              </div>
            ) : (
              <span className="text-ink-muted">Select a delivery company...</span>
            )}
            <svg
              className={`w-4 h-4 text-ink-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-creme-border rounded-xl shadow-lg overflow-hidden py-1 divide-y divide-creme-border/50 animate-in fade-in slide-in-from-top-1 duration-150">
              {DELIVERY_COMPANIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleCompanyChange(c.id)}
                  className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-creme-bg transition-colors duration-150 cursor-pointer ${selectedCompanyId === c.id ? 'bg-creme-bg' : ''
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded border ${c.color}`}>
                      {c.badge}
                    </span>
                    <span className="text-sm font-medium text-ink-primary">{c.name}</span>
                  </div>
                  {selectedCompanyId === c.id && (
                    <svg className="w-4 h-4 text-accent-warm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Field 1 */}
        {(!selectedCompany || selectedCompany.field1) && (
          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-ink-secondary"
              htmlFor="field-1"
            >
              {selectedCompany?.field1?.label || 'API Key / ID'}
            </label>
            <input
              id="field-1"
              type={selectedCompany?.field1?.type || 'text'}
              className="w-full px-4 py-3 bg-creme-bg border border-creme-border rounded-lg text-ink-primary text-sm outline-none transition-all duration-200 placeholder:text-ink-muted focus:border-accent-warm focus:ring-3 focus:ring-accent-warm/15 focus:bg-white"
              placeholder={selectedCompany?.field1?.placeholder || 'Select a delivery company first...'}
              value={field1Val}
              onChange={(e) => setField1Val(e.target.value)}
              required
            />
          </div>
        )}

        {/* Dynamic Field 2 */}
        <div className="flex flex-col gap-2">
          <label
            className="text-xs font-semibold uppercase tracking-wider text-ink-secondary"
            htmlFor="field-2"
          >
            {selectedCompany?.field2?.label || 'API Token / Secret'}
          </label>
          <input
            id="field-2"
            type={selectedCompany?.field2?.type || 'password'}
            className="w-full px-4 py-3 bg-creme-bg border border-creme-border rounded-lg text-ink-primary text-sm outline-none transition-all duration-200 placeholder:text-ink-muted focus:border-accent-warm focus:ring-3 focus:ring-accent-warm/15 focus:bg-white"
            placeholder={selectedCompany?.field2?.placeholder || 'Select a delivery company first...'}
            value={field2Val}
            onChange={(e) => setField2Val(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-3.5 px-6 bg-ink-primary text-creme-bg rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:bg-accent-warm hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying Credentials...' : 'Validate Credentials'}
        </button>
      </form>

      {status !== 'idle' && (
        <div
          className={`mt-6 p-4 rounded-lg flex items-center gap-3 transition-all duration-300 ${status === 'valid'
            ? 'bg-[#edf4ef] border border-[#b8d8c4] text-[#2d5a42]'
            : 'bg-[#fdf2f0] border border-[#ecc2bd] text-[#8c362b]'
            }`}
          role="status"
        >
          {status === 'valid' ? (
            <>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Credentials Validated Successfully</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium">Validation Failed: Invalid API Credentials</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
