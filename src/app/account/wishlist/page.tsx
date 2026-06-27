import Link from 'next/link';
import { Heart } from 'lucide-react';

import { auth } from '@/auth';
import { getUserWishlist } from '@/lib/queries';
import { ProductGrid } from '@/components/ui/ProductGrid';

export default async function WishlistPage() {
  const session = await auth();
  const products = await getUserWishlist(session!.user.id);

  if (products.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-4 p-12 text-center">
        <Heart size={30} className="text-smoke" />
        <h2 className="text-lg font-semibold text-white">Your wishlist is empty</h2>
        <p className="max-w-sm text-sm text-smoke">Tap the heart on any product to save it here for later.</p>
        <Link href="/shop" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">Saved items ({products.length})</h2>
      <ProductGrid products={products} />
    </div>
  );
}
