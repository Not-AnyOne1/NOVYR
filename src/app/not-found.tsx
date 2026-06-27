import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-radial-fade" />
      <p className="font-display text-[8rem] font-extrabold leading-none tracking-tightest text-ink-500 sm:text-[12rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">This page went off-grid.</h1>
      <p className="mt-3 max-w-sm text-sm text-smoke">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to the drop.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">Back home</Link>
        <Link href="/shop" className="btn-secondary">Shop The Drop</Link>
      </div>
    </div>
  );
}
