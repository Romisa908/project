
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ClaimForm from './components/ClaimForm';
import ResultView from './components/ResultView';
import { HistoryItem, VerificationResult } from './types';
import { verifyClaim } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('derm_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleVerify = async (claim: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const verification = await verifyClaim(claim);
      setResult(verification);
      
      const newItem: HistoryItem = {
        ...verification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };
      
      const updatedHistory = [newItem, ...history].slice(0, 10);
      setHistory(updatedHistory);
      localStorage.setItem('derm_history', JSON.stringify(updatedHistory));
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('derm_history');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black font-display text-slate-900 mb-4 tracking-tight">
            Stop guessing, start <span className="text-emerald-600">verifying.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Science-backed analysis for viral skin and hair trends. 
            Protect your health with evidence, not myths.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-8">
            <ClaimForm onVerify={handleVerify} isLoading={loading} />
            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {result && <ResultView result={result} />}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Recent Analysis</span>
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest font-bold">
                    Clear
                  </button>
                )}
              </div>
              
              <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {history.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400">No recent checks yet.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id} 
                      className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => setResult(item)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          item.classification.includes('Supported') && !item.classification.includes('Not') 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : item.classification.includes('Partially') 
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {item.classification}
                        </span>
                        <span className="text-[10px] text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2 font-medium group-hover:text-emerald-600 transition-colors">
                        "{item.claim}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-slate-400 text-xs leading-relaxed">
              <p className="font-bold text-slate-200 mb-2 uppercase tracking-widest flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Medical Disclaimer
              </p>
              DermVerify AI is an analysis tool for educational purposes only. It does not provide medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider (dermatologist) with any questions regarding a medical condition. Results are based on AI interpretations of available scientific literature.
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} DermVerify AI. Built for Evidence-Based Skincare.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
