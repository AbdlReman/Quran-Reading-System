'use client';

import { usePathname } from 'next/navigation';
import TrialClassPopup from '@/components/TrialClassPopup';

export default function SiteExtras() {
  const pathname = usePathname();
  const hideSiteChrome = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');

  if (hideSiteChrome) return null;

  return (
    <>
      <TrialClassPopup />
      <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
        <a
          href="https://wa.me/923215507499"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp: +92 321 5507499"
          className="inline-flex items-center justify-center hover:opacity-90"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            width="56"
            height="56"
            className="block"
          />
        </a>
      </div>
    </>
  );
}
