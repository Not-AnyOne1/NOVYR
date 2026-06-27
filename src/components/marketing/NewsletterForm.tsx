'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { trackLead } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export function NewsletterForm({
  source = 'footer',
  className,
  placeholder = 'Enter your email',
}: {
  source?: string;
  className?: string;
  placeholder?: string;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setDone(true);
      trackLead(source);
      toast.success('Welcome to the movement. Check your inbox.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-electric-300', className)}>
        <Check size={18} /> You&apos;re in. Watch your inbox for early access.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn('flex w-full max-w-md items-center gap-2', className)}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="input flex-1"
        aria-label="Email address"
      />
      <button type="submit" disabled={loading} className="btn-primary shrink-0 px-5" aria-label="Subscribe">
        {loading ? '…' : <ArrowRight size={18} />}
      </button>
    </form>
  );
}
