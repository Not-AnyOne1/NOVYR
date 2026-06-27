export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h1>
      {updated && <p className="mt-2 text-xs text-smoke-dark">Last updated: {updated}</p>}
      <div className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:text-xl prose-h2:text-white prose-p:text-smoke-light prose-li:text-smoke-light prose-a:text-electric-300 prose-strong:text-white">
        {children}
      </div>
    </div>
  );
}
