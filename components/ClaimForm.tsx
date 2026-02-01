
import React, { useState } from 'react';

interface ClaimFormProps {
  onVerify: (claim: string) => void;
  isLoading: boolean;
}

const ClaimForm: React.FC<ClaimFormProps> = ({ onVerify, isLoading }) => {
  const [claim, setClaim] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (claim.trim().length < 5) return;
    onVerify(claim);
  };

  const suggestions = [
    "Lemon juice for skin brightening",
    "Retinol prevents wrinkles",
    "Onion juice for hair growth",
    "SPF is only needed on sunny days",
    "Niacinamide and Vitamin C cannot be mixed"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">Paste a Claim</h2>
      <p className="text-slate-500 mb-6">Enter a trend, product promise, or home remedy you've seen online.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="e.g., Applying undiluted apple cider vinegar to the face clears acne in 3 days..."
          className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-slate-700"
          required
        />
        <button
          type="submit"
          disabled={isLoading || claim.trim().length < 5}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Consulting Evidence...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Verify Claim</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Trending Checks</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => { setClaim(s); onVerify(s); }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-full text-xs font-medium transition-colors border border-transparent hover:border-emerald-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimForm;
