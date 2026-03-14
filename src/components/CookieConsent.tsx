import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else if (consent === 'granted') {
      // If already granted, update Google Consent Mode immediately
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted'
        });
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'granted');
    setShowBanner(false);
    
    // Update Google Consent Mode
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'denied');
    setShowBanner(false);
    
    // Update Google Consent Mode (already denied by default, but good practice)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
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
            onClick={handleDecline}
            className="px-4 py-2 text-sm font-semibold text-zinc-300 bg-transparent border border-[#2A2A2A] rounded-lg hover:bg-[#2A2A2A] transition-colors"
          >
            Decline All
          </button>
          <button 
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-bold text-black bg-[#CCFF00] rounded-lg hover:bg-[#b3e600] transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
