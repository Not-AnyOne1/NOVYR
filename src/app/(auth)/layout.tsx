import Link from 'next/link';
import { SITE } from '@/lib/constants';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-radial-fade" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-3xl font-extrabold tracking-tightest text-white">
            NOVYR
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-smoke-dark">{SITE.slogan}</p>
        </div>
        <div className="card p-7 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
