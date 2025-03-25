'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IoClose } from "react-icons/io5";
import { BsCheck } from "react-icons/bs";

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: true,
    marketing: true,
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('cookieSettings');
    if (!savedSettings) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const settings: CookieSettings = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookieSettings', JSON.stringify(settings));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const settings: CookieSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookieSettings', JSON.stringify(settings));
    setIsVisible(false);
  };

  const handleDecline = () => {
    const settings: CookieSettings = {
      necessary: true, // Necessary cookies can't be declined
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookieSettings', JSON.stringify(settings));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    setIsVisible(false);
  };

  const CustomCheckbox = ({ checked, onChange, disabled = false }: { 
    checked: boolean; 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
  }) => (
    <label className={`relative inline-flex items-center justify-center w-5 h-5 rounded-[4px] border ${
      disabled 
        ? 'border-text/20 bg-accent/30' 
        : checked 
          ? 'border-text bg-accent' 
          : 'border-text/20 hover:border-text'
    } transition-colors cursor-pointer`}>
      <input
        type="checkbox"
        className="absolute opacity-0 w-0 h-0"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {checked && <BsCheck className={`text-lg ${disabled ? 'text-text/50' : 'text-text'}`} />}
    </label>
  );

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-text/20 z-[60] transform transition-all duration-300 ${
        showDetails ? 'max-lg:h-[100dvh] md:max-h-[600px]' : ''
      }`}>
        <div className={`max-w-[1600px] mx-auto h-full flex flex-col`}>
          {!showDetails ? (
            // Simple View
            <div className="p-3 md:p-6">
              <div className="flex flex-col gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text/70">
                    We gebruiken cookies om je ervaring te verbeteren.{' '}
                    <button 
                      onClick={() => setShowDetails(true)}
                      className="underline hover:text-text transition-colors"
                    >
                      Voorkeuren aanpassen
                    </button>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={handleDecline}
                    className="px-3 py-2 border border-text/20 text-text rounded-[100px] hover:bg-accent transition-colors text-sm font-medium order-3 sm:order-1"
                  >
                    Weigeren
                  </button>
                  <button
                    onClick={handleAcceptNecessary}
                    className="px-3 py-2 border border-text text-text rounded-[100px] hover:bg-accent transition-colors text-sm font-medium order-2"
                  >
                    Alleen noodzakelijk
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-3 py-2 bg-accent text-text rounded-[100px] hover:bg-accent/70 transition-colors text-sm font-medium order-1 sm:order-3"
                  >
                    Alles accepteren
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Detailed View with flex layout to ensure footer stays at bottom
            <div className="flex flex-col h-full">
              {/* Scrollable Content Area */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4 md:p-8 space-y-4 md:space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-bold mb-2 text-text">Cookie voorkeuren</h2>
                      <p className="text-sm text-text/70">
                        Beheer hieronder je cookie voorkeuren. Deze instellingen helpen ons om je ervaring te verbeteren en de website beter te laten functioneren.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowDetails(false)}
                      className="p-1.5 hover:bg-accent rounded-full transition-colors shrink-0"
                    >
                      <IoClose className="text-xl text-text" />
                    </button>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {/* Necessary Cookies */}
                    <div 
                      className="flex items-start justify-between p-4 md:p-6 bg-accent/30 rounded-xl gap-4 cursor-not-allowed"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-text">Noodzakelijk</h3>
                          <span className="text-xs bg-accent px-2 py-0.5 rounded-[100px] text-text">Vereist</span>
                        </div>
                        <p className="text-sm text-text/70 mt-1">
                          Deze cookies zijn essentieel voor het functioneren van de website. Ze maken basisfuncties mogelijk zoals navigatie en toegang tot beveiligde delen van de website.
                        </p>
                      </div>
                      <CustomCheckbox checked={cookieSettings.necessary} disabled />
                    </div>

                    {/* Analytics Cookies */}
                    <div 
                      onClick={() => setCookieSettings(prev => ({
                        ...prev,
                        analytics: !prev.analytics
                      }))}
                      className="flex items-start justify-between p-4 md:p-6 bg-accent/30 rounded-xl gap-4 cursor-pointer hover:bg-accent/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-text">Analytics</h3>
                        <p className="text-sm text-text/70 mt-1">
                          Deze cookies helpen ons te begrijpen hoe bezoekers onze website gebruiken. Ze verzamelen anonieme gegevens die ons helpen de website te verbeteren en de gebruikerservaring te optimaliseren.
                        </p>
                      </div>
                      <CustomCheckbox 
                        checked={cookieSettings.analytics}
                        onChange={() => {}} // Handle click on the entire div instead
                      />
                    </div>

                    {/* Marketing Cookies */}
                    <div 
                      onClick={() => setCookieSettings(prev => ({
                        ...prev,
                        marketing: !prev.marketing
                      }))}
                      className="flex items-start justify-between p-4 md:p-6 bg-accent/30 rounded-xl gap-4 cursor-pointer hover:bg-accent/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-text">Marketing</h3>
                        <p className="text-sm text-text/70 mt-1">
                          Deze cookies worden gebruikt om advertenties relevanter te maken voor jou. Ze helpen ons ook om de effectiviteit van onze marketingcampagnes te meten en te verbeteren.
                        </p>
                      </div>
                      <CustomCheckbox 
                        checked={cookieSettings.marketing}
                        onChange={() => {}} // Handle click on the entire div instead
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer - Always visible */}
              <div className="border-t border-text/20 p-4 bg-white mt-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleDecline}
                    className="px-3 py-2 border border-text/20 text-text rounded-[100px] hover:bg-accent transition-colors text-sm font-medium order-3 sm:order-1"
                  >
                    Alles weigeren
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-3 py-2 border border-text text-text rounded-[100px] hover:bg-accent transition-colors text-sm font-medium order-2"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="px-3 py-2 bg-accent text-text rounded-[100px] hover:bg-accent/70 transition-colors text-sm font-medium order-1 sm:order-3"
                  >
                    Voorkeuren opslaan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 