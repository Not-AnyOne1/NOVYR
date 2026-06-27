'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Send, Check } from 'lucide-react';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setDone(true);
      toast.success('Message sent. We will be in touch.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-electric/15 text-electric"><Check size={24} /></span>
        <h3 className="text-lg font-semibold text-white">Message sent</h3>
        <p className="text-sm text-smoke">Thanks for reaching out — we typically reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Name</label>
          <input value={form.name} onChange={set('name')} className="input" required minLength={2} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" value={form.email} onChange={set('email')} className="input" required />
        </div>
      </div>
      <div>
        <label className="label">Subject</label>
        <input value={form.subject} onChange={set('subject')} className="input" placeholder="How can we help?" />
      </div>
      <div>
        <label className="label">Message</label>
        <textarea value={form.message} onChange={set('message')} className="input min-h-[140px] resize-y" required minLength={5} />
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        <Send size={18} /> {loading ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
