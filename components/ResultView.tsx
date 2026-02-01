
import React from 'react';
import { VerificationResult, VerificationStatus } from '../types';

interface ResultViewProps {
  result: VerificationResult;
}

const ResultView: React.FC<ResultViewProps> = ({ result }) => {
  const getStatusColors = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.SUPPORTED:
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: '✅' };
      case VerificationStatus.PARTIAL:
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: '⚠️' };
      case VerificationStatus.NOT_SUPPORTED:
        return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: '❌' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: '❓' };
    }
  };

  const colors = getStatusColors(result.classification as VerificationStatus);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className={`p-6 rounded-2xl border ${colors.border} ${colors.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-tight ${colors.text} bg-white shadow-sm border border-slate-100`}>
            {colors.icon} {result.classification}
          </span>
          <div className="text-xs font-medium text-slate-400">
            Confidence: {Math.round(result.confidenceScore * 100)}%
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 italic">"{result.claim}"</h3>
        <p className="text-slate-700 leading-relaxed">{result.scientificExplanation}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-900">Ingredients Identified</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.ingredients.map((ing, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                {ing}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-900">Potential Risks</h4>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{result.potentialRisks}</p>
        </div>
      </div>

      <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-100">
        <div className="flex items-center space-x-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="font-bold text-lg">Safe Evidence-Based Alternatives</h4>
        </div>
        <ul className="space-y-3">
          {result.alternatives.map((alt, i) => (
            <li key={i} className="flex items-start space-x-3 text-emerald-50">
              <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 bg-emerald-300 rounded-full" />
              <span className="text-sm font-medium">{alt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultView;
