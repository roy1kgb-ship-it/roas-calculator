import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    other: true
  });

  const updateGtag = () => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    }
  };

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      updateGtag();
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ other: true }));
    updateGtag();
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({ other: true }));
    updateGtag();
    setShowBanner(false);
    setShowModal(false);
  };

  const Toggle = ({ checked, onChange, disabled = false }: { checked: boolean, onChange?: () => void, disabled?: boolean }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${checked ? 'bg-[#CCFF00]' : 'bg-zinc-600'}`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* Bottom Banner */}
      {showBanner && !showModal && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 bg-[#141414] border-t border-[#2A2A2A] shadow-2xl print:hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-zinc-400 text-center md:text-left">
              <p>
                We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic. 
                We also share information about your use of our site with our advertising and analytics partners.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm font-semibold text-zinc-300 bg-transparent border border-[#2A2A2A] rounded-lg hover:bg-[#2A2A2A] transition-colors"
              >
                Manage
              </button>
              <button 
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-bold text-black bg-[#CCFF00] rounded-lg hover:bg-[#b3e600] transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:hidden">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-5 border-b border-[#2A2A2A]">
              <h2 className="text-lg font-semibold text-white">Cookie Preferences</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6 overflow-y-auto">
              {/* Strictly Necessary */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Strictly Necessary</h3>
                  <p className="text-xs text-zinc-400">Required for the website to function properly. Cannot be disabled.</p>
                </div>
                <Toggle checked={true} disabled={true} />
              </div>

              {/* Other */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Other</h3>
                  <p className="text-xs text-zinc-400">Includes analytics cookies that allow us to count visits and traffic sources so we can measure and improve the performance of our site. Cannot be disabled.</p>
                </div>
                <Toggle 
                  checked={true} 
                  disabled={true} 
                />
              </div>
            </div>

            <div className="p-5 border-t border-[#2A2A2A] flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleAcceptAll}
                className="w-full px-4 py-2 text-sm font-bold text-black bg-[#CCFF00] rounded-lg hover:bg-[#b3e600] transition-colors order-2 sm:order-1"
              >
                Accept All
              </button>
              <button 
                onClick={handleSavePreferences}
                className="w-full px-4 py-2 text-sm font-semibold text-zinc-300 bg-transparent border border-[#2A2A2A] rounded-lg hover:bg-[#2A2A2A] transition-colors order-1 sm:order-2"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
