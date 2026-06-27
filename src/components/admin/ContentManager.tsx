'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Trash2, Save, Megaphone, Images, LayoutTemplate } from 'lucide-react';

type HeroSlide = { id: string; eyebrow: string | null; title: string; subtitle: string | null; ctaLabel: string | null; ctaHref: string | null; image: string };
type LookImage = { id: string; url: string; caption: string | null; span: string | null };

export function ContentManager({
  announcement,
  hero,
  lookbook,
}: {
  announcement: { enabled: boolean; messages: string[] };
  hero: HeroSlide[];
  lookbook: LookImage[];
}) {
  const router = useRouter();

  // Announcement
  const [annEnabled, setAnnEnabled] = useState(announcement.enabled);
  const [messages, setMessages] = useState<string[]>(announcement.messages.length ? announcement.messages : ['']);
  const [savingAnn, setSavingAnn] = useState(false);

  async function saveAnnouncement() {
    setSavingAnn(true);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'announcement', value: { enabled: annEnabled, messages: messages.map((m) => m.trim()).filter(Boolean) } }),
      });
      if (!res.ok) throw new Error();
      toast.success('Announcement saved');
      router.refresh();
    } catch {
      toast.error('Could not save');
    } finally {
      setSavingAnn(false);
    }
  }

  // Hero
  const [heroForm, setHeroForm] = useState({ eyebrow: '', title: '', subtitle: '', ctaLabel: '', ctaHref: '', image: '' });
  const [heroOpen, setHeroOpen] = useState(false);

  async function addHero() {
    if (!heroForm.title || !heroForm.image) return toast.error('Title and image are required');
    const res = await fetch('/api/admin/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroForm),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error ?? 'Failed');
    toast.success('Slide added');
    setHeroForm({ eyebrow: '', title: '', subtitle: '', ctaLabel: '', ctaHref: '', image: '' });
    setHeroOpen(false);
    router.refresh();
  }

  async function deleteHero(id: string) {
    if (!window.confirm('Delete this slide?')) return;
    await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  // Lookbook
  const [lookForm, setLookForm] = useState({ url: '', caption: '', span: 'normal' });

  async function addLook() {
    if (!lookForm.url) return toast.error('Image URL is required');
    const res = await fetch('/api/admin/lookbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lookForm),
    });
    const data = await res.json();
    if (!res.ok) return toast.error(data.error ?? 'Failed');
    toast.success('Image added');
    setLookForm({ url: '', caption: '', span: 'normal' });
    router.refresh();
  }

  async function deleteLook(id: string) {
    await fetch(`/api/admin/lookbook/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Announcement */}
      <section className="card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white">
          <Megaphone size={16} className="text-electric" /> Announcement bar
        </h2>
        <label className="mb-4 flex items-center gap-2 text-sm text-smoke-light">
          <input type="checkbox" checked={annEnabled} onChange={(e) => setAnnEnabled(e.target.checked)} className="rounded border-charcoal-border bg-ink-800 text-electric focus:ring-electric" />
          Show announcement bar
        </label>
        <div className="space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={m} onChange={(e) => setMessages(messages.map((x, idx) => (idx === i ? e.target.value : x)))} className="input flex-1" placeholder="🚚 FREE DELIVERY ANYWHERE IN MOROCCO" />
              <button onClick={() => setMessages(messages.filter((_, idx) => idx !== i))} className="text-smoke hover:text-rose-400"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => setMessages([...messages, ''])} className="btn-secondary px-3 py-1.5 text-xs"><Plus size={14} /> Add message</button>
          <button onClick={saveAnnouncement} disabled={savingAnn} className="btn-primary px-4 py-1.5 text-xs"><Save size={14} /> {savingAnn ? 'Saving…' : 'Save'}</button>
        </div>
      </section>

      {/* Hero slides */}
      <section className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white">
            <LayoutTemplate size={16} className="text-electric" /> Hero slides
          </h2>
          {!heroOpen && <button onClick={() => setHeroOpen(true)} className="btn-secondary px-3 py-1.5 text-xs"><Plus size={14} /> Add slide</button>}
        </div>

        {heroOpen && (
          <div className="mb-4 grid gap-3 rounded-xl border border-charcoal-border p-4 sm:grid-cols-2">
            <input value={heroForm.eyebrow} onChange={(e) => setHeroForm((f) => ({ ...f, eyebrow: e.target.value }))} className="input" placeholder="Eyebrow (e.g. NEW DROP)" />
            <input value={heroForm.title} onChange={(e) => setHeroForm((f) => ({ ...f, title: e.target.value }))} className="input" placeholder="Title *" />
            <input value={heroForm.subtitle} onChange={(e) => setHeroForm((f) => ({ ...f, subtitle: e.target.value }))} className="input sm:col-span-2" placeholder="Subtitle" />
            <input value={heroForm.ctaLabel} onChange={(e) => setHeroForm((f) => ({ ...f, ctaLabel: e.target.value }))} className="input" placeholder="Button label" />
            <input value={heroForm.ctaHref} onChange={(e) => setHeroForm((f) => ({ ...f, ctaHref: e.target.value }))} className="input" placeholder="Button link (/shop)" />
            <input value={heroForm.image} onChange={(e) => setHeroForm((f) => ({ ...f, image: e.target.value }))} className="input sm:col-span-2" placeholder="Image URL *" />
            <div className="flex gap-2 sm:col-span-2">
              <button onClick={addHero} className="btn-primary px-4 py-1.5 text-xs">Add slide</button>
              <button onClick={() => setHeroOpen(false)} className="btn-ghost text-xs">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {hero.map((s) => (
            <div key={s.id} className="flex gap-3 rounded-xl border border-charcoal-border p-3">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                {s.image && <Image src={s.image} alt="" fill sizes="80px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{s.title}</p>
                <p className="truncate text-xs text-smoke">{s.subtitle}</p>
              </div>
              <button onClick={() => deleteHero(s.id)} className="text-smoke hover:text-rose-400"><Trash2 size={15} /></button>
            </div>
          ))}
          {hero.length === 0 && <p className="text-sm text-smoke">No hero slides — the homepage uses a default.</p>}
        </div>
      </section>

      {/* Lookbook */}
      <section className="card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white">
          <Images size={16} className="text-electric" /> Lookbook
        </h2>
        <div className="mb-4 grid gap-3 rounded-xl border border-charcoal-border p-4 sm:grid-cols-[1fr_1fr_auto_auto]">
          <input value={lookForm.url} onChange={(e) => setLookForm((f) => ({ ...f, url: e.target.value }))} className="input" placeholder="Image URL *" />
          <input value={lookForm.caption} onChange={(e) => setLookForm((f) => ({ ...f, caption: e.target.value }))} className="input" placeholder="Caption" />
          <select value={lookForm.span} onChange={(e) => setLookForm((f) => ({ ...f, span: e.target.value }))} className="input">
            <option value="normal" className="bg-ink-800">Normal</option>
            <option value="wide" className="bg-ink-800">Wide</option>
            <option value="tall" className="bg-ink-800">Tall</option>
          </select>
          <button onClick={addLook} className="btn-primary px-4 text-xs"><Plus size={14} /> Add</button>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {lookbook.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg bg-ink-800">
              {img.url && <Image src={img.url} alt={img.caption ?? ''} fill sizes="120px" className="object-cover" />}
              <button onClick={() => deleteLook(img.id)} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-ink-900/80 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-400">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          {lookbook.length === 0 && <p className="col-span-full text-sm text-smoke">No lookbook images yet.</p>}
        </div>
      </section>
    </div>
  );
}
