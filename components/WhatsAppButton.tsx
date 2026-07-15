'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/21652690163"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <div className="w-14 h-14 flex items-center justify-center">
        <MessageCircle className="w-6 h-6" />
      </div>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pr-0 group-hover:pr-4 text-sm font-medium">
        WhatsApp
      </span>
    </a>
  );
}
