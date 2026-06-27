'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function WishlistButton({
  productId,
  initialActive = false,
  className,
  size = 18,
}: {
  productId: string;
  initialActive?: boolean;
  className?: string;
  size?: number;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (status !== 'authenticated') {
      toast('Sign in to save favorites', {
        action: { label: 'Sign in', onClick: () => router.push('/login') },
      });
      return;
    }
    setLoading(true);
    const next = !active;
    setActive(next);
    try {
      const res = await fetch('/api/wishlist', {
        method: next ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error();
      toast.success(next ? 'Added to wishlist' : 'Removed from wishlist');
    } catch {
      setActive(!next);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-ink-900/70 text-white backdrop-blur transition-all hover:border-white/30 hover:bg-ink-800 active:scale-90',
        className
      )}
    >
      <Heart size={size} className={cn(active ? 'fill-bone text-bone' : 'text-white')} strokeWidth={1.75} />
    </button>
  );
}
