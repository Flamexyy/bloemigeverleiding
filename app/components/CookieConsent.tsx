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
    <label className={`relative inline-flex items-center justify-center w-5 h-5 rounded border ${
      disabled 
        ? 'border-gray-300 bg-gray-100' 
        : checked 
          ? 'border-black bg-black' 
          : 'border-gray-300 hover:border-gray-400'
    } transition-colors cursor-pointer`}>
      <input
        type="checkbox"
        className="absolute opacity-0 w-0 h-0"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      {checked && <BsCheck className={`text-lg ${disabled ? 'text-gray-500' : 'text-white'}`} />}
    </label>
  );

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-[60] transform transition-transform duration-300">
        <div className="max-w-[1600px] mx-auto p-3 md:p-6">
          {!showDetails ? (
            // Simple View
            <div className="flex flex-col gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your experience.{' '}
                  <button 
                    onClick={() => setShowDetails(true)}
                    className="underline hover:text-black transition-colors"
                  >
                    Customize preferences
                  </button>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={handleDecline}
                  className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium order-3 sm:order-1"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptNecessary}
                  className="px-3 py-2 border border-black text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium order-2"
                >
                  Necessary
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-3 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm font-medium order-1 sm:order-3"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            // Detailed View
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold mb-1">Cookie Preferences</h2>
                  <p className="text-sm text-gray-600">
                    Manage your cookie preferences below.
                  </p>
                </div>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Necessary Cookies */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold">Necessary</h3>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">Required</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Essential for the website to function.
                    </p>
                  </div>
                  <CustomCheckbox checked={cookieSettings.necessary} disabled />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bold">Analytics</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Help us understand website usage.
                    </p>
                  </div>
                  <CustomCheckbox 
                    checked={cookieSettings.analytics}
                    onChange={(e) => setCookieSettings(prev => ({
                      ...prev,
                      analytics: e.target.checked
                    }))}
                  />
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between p-3 bg-gray-50 rounded-xl gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bold">Marketing</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Used for relevant advertisements.
                    </p>
                  </div>
                  <CustomCheckbox 
                    checked={cookieSettings.marketing}
                    onChange={(e) => setCookieSettings(prev => ({
                      ...prev,
                      marketing: e.target.checked
                    }))}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <button
                  onClick={handleDecline}
                  className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium order-3 sm:order-1"
                >
                  Decline All
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-3 py-2 border border-black text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium order-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-3 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm font-medium order-1 sm:order-3"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 