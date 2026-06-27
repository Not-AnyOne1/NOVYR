'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

export function DeleteButton({
  endpoint,
  label = 'Delete',
  confirmText = 'Delete this item? This cannot be undone.',
  onDeleted,
}: {
  endpoint: string;
  label?: string;
  confirmText?: string;
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!window.confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Deleted');
      if (onDeleted) onDeleted();
      router.refresh();
    } catch {
      toast.error('Could not delete');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-smoke transition-colors hover:bg-rose-500/10 hover:text-rose-400"
    >
      <Trash2 size={14} /> {label}
    </button>
  );
}
