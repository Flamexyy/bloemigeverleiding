"use client";
import Script from "next/script";

export default function CheckoutFavicon() {
  return (
    <Script
      id="checkout-favicon"
      strategy="afterInteractive"
    >
      {`
        // This script runs on the client side and adds favicon links to the checkout page
        if (window.location.hostname.includes('checkout.bloemigeverleiding.nl')) {
          const head = document.head || document.getElementsByTagName('head')[0];
          
          // Apple Touch Icon
          const appleTouchIcon = document.createElement('link');
          appleTouchIcon.rel = 'apple-touch-icon';
          appleTouchIcon.sizes = '180x180';
          appleTouchIcon.href = 'https://bloemigeverleiding.nl/favicon_io/apple-touch-icon.png';
          head.appendChild(appleTouchIcon);
          
          // Favicon 32x32
          const favicon32 = document.createElement('link');
          favicon32.rel = 'icon';
          favicon32.type = 'image/png';
          favicon32.sizes = '32x32';
          favicon32.href = 'https://bloemigeverleiding.nl/favicon_io/favicon-32x32.png';
          head.appendChild(favicon32);
          
          // Favicon 16x16
          const favicon16 = document.createElement('link');
          favicon16.rel = 'icon';
          favicon16.type = 'image/png';
          favicon16.sizes = '16x16';
          favicon16.href = 'https://bloemigeverleiding.nl/favicon_io/favicon-16x16.png';
          head.appendChild(favicon16);
          
          // Web Manifest
          const manifest = document.createElement('link');
          manifest.rel = 'manifest';
          manifest.href = 'https://bloemigeverleiding.nl/favicon_io/site.webmanifest';
          head.appendChild(manifest);
        }
      `}
    </Script>
  );
}
