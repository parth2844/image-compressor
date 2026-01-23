import { useState } from 'react';

export default function PrivacyNotice() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg overflow-hidden">
      {/* Main Notice */}
      <div className="p-3">
        <div className="flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Your images never leave your browser</p>
            <p className="text-xs text-green-600 mt-0.5">All processing happens locally on your device.</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-2 text-xs text-green-700 hover:text-green-900 font-medium flex items-center gap-1"
        >
          {showDetails ? 'Hide details' : 'Learn why →'}
        </button>
      </div>

      {/* Expanded Explanation */}
      {showDetails && (
        <div className="px-3 pb-3 pt-2 border-t border-green-200 bg-green-50/50">
          <div className="space-y-3 text-sm">
            {/* Comparison */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-red-500 font-bold text-xs mt-0.5">✕</span>
                <div>
                  <p className="font-medium text-gray-700">Other tools</p>
                  <p className="text-xs text-gray-500">
                    Your photo → Internet → Their server → Internet → Back to you
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold text-xs mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-gray-700">This tool</p>
                  <p className="text-xs text-gray-500">
                    Your photo → Your browser → Done (never leaves your device)
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Explanation */}
            <div className="bg-white/60 rounded p-2.5 text-xs text-gray-600 space-y-2">
              <p>
                <strong>How is this possible?</strong> Your web browser has a built-in image editor 
                called the <span className="font-medium text-green-700">Canvas API</span>. It's like 
                a mini Photoshop that comes free with Chrome, Safari, and Firefox.
              </p>
              <p>
                When you drop an image here, your browser reads it, shrinks it down, and creates a 
                new smaller file—all without sending anything over the internet.
              </p>
              <p>
                Think of it like editing a document in Microsoft Word on your computer, versus 
                uploading it to Google Docs. One stays on your machine, the other goes to the cloud.
              </p>
            </div>

            {/* Tech Note */}
            <p className="text-xs text-gray-400">
              Technical: Uses Canvas API for encoding, Web Workers for non-blocking processing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
