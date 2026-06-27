'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production, forward to your error tracker (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl font-extrabold text-white">Something went wrong</h1>
      <p className="mt-3 max-w-sm text-sm text-smoke">
        We hit an unexpected error. Please try again — if it keeps happening, our team has been notified.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button onClick={reset} className="btn-primary">
          <RefreshCw size={18} /> Try again
        </button>
        <Link href="/" className="btn-secondary">Back home</Link>
      </div>
    </div>
  );
}
