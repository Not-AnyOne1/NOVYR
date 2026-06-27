'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Lock, Tag, Check, Banknote, ShieldCheck, Truck } from 'lucide-react';

import { useCartStore, cartSubtotalCents } from '@/store/cart';
import { formatMAD } from '@/lib/utils';
import { MOROCCO_CITIES } from '@/lib/constants';
import { checkoutFormSchema, type CheckoutFormInput } from '@/lib/validations';
import { trackPurchase } from '@/lib/analytics';

export function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: sessionData } = useSession();
  const { items, clear } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const [code, setCode] = useState(searchParams.get('code')?.toUpperCase() ?? '');
  const [discount, setDiscount] = useState<{ cents: number; code: string } | null>(null);
  const [codeMsg, setCodeMsg] = useState('');
  const [applying, setApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { city: '' },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sessionData?.user?.name) setValue('fullName', sessionData.user.name);
    if (sessionData?.user?.email) setValue('email', sessionData.user.email);
  }, [sessionData, setValue]);

  const subtotal = cartSubtotalCents(items);

  // Auto-validate a code passed via URL
  useEffect(() => {
    if (!code || !subtotal) return;
    void applyCode(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const discountCents = discount?.cents ?? 0;
  const total = Math.max(0, subtotal - discountCents);

  async function applyCode(c?: string) {
    const value = (c ?? code).trim();
    if (!value) return;
    setApplying(true);
    setCodeMsg('');
    try {
      const res = await fetch('/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: value, subtotalCents: subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setDiscount(null);
        setCodeMsg(data.message ?? 'Invalid code');
      } else {
        setDiscount({ cents: data.discountCents, code: data.code });
        setCodeMsg(data.message ?? 'Applied');
      }
    } catch {
      setCodeMsg('Could not validate code');
    } finally {
      setApplying(false);
    }
  }

  async function onSubmit(values: CheckoutFormInput) {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          discountCode: discount?.code,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            size: i.size,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not place order');

      trackPurchase({
        orderNumber: data.orderNumber,
        totalCents: data.totalCents,
        items: data.items,
      });
      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  if (!mounted) return <div className="mx-auto max-w-6xl px-4 py-20" />;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
        <h1 className="font-display text-3xl font-extrabold text-white">Your cart is empty</h1>
        <p className="text-sm text-smoke">Add something to the cart before checking out.</p>
        <Link href="/shop" className="btn-primary">Shop The Drop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white">Checkout</h1>
        <span className="inline-flex items-center gap-1.5 text-xs text-smoke">
          <Lock size={14} className="text-electric" /> Secure checkout
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-10 lg:grid-cols-[1fr_400px]">
        {/* Left — details */}
        <div className="order-2 space-y-8 lg:order-1">
          {/* Contact */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Contact details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message}>
                <input {...register('fullName')} className="input" placeholder="Your full name" autoComplete="name" />
              </Field>
              <Field label="Phone number" error={errors.phone?.message}>
                <input {...register('phone')} className="input" placeholder="0612345678" inputMode="tel" autoComplete="tel" />
              </Field>
              <Field label="Email (optional)" error={errors.email?.message} className="sm:col-span-2">
                <input {...register('email')} className="input" placeholder="you@email.com — for order updates" autoComplete="email" />
              </Field>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City" error={errors.city?.message}>
                <select {...register('city')} className="input">
                  <option value="">Select city</option>
                  {MOROCCO_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-ink-800">{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Region (optional)" error={errors.region?.message}>
                <input {...register('region')} className="input" placeholder="e.g. Casablanca-Settat" />
              </Field>
              <Field label="Full address" error={errors.address?.message} className="sm:col-span-2">
                <input {...register('address')} className="input" placeholder="Street, building, apartment…" autoComplete="street-address" />
              </Field>
              <Field label="Delivery note (optional)" className="sm:col-span-2">
                <textarea {...register('note')} className="input min-h-[72px] resize-y" placeholder="Landmarks, delivery preferences…" />
              </Field>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Payment method</h2>
            <div className="flex items-center gap-3 rounded-xl border border-electric bg-electric/5 p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-electric/15 text-electric">
                <Banknote size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Cash on Delivery</p>
                <p className="text-xs text-smoke">Pay with cash when your order arrives. No card required.</p>
              </div>
              <Check size={20} className="text-electric" />
            </div>
          </section>
        </div>

        {/* Right — summary */}
        <div className="order-1 h-fit lg:order-2 lg:sticky lg:top-24">
          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Your order</h2>

            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-ink-800">
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />}
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-electric px-1 text-[10px] font-bold text-white">{item.quantity}</span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-1 text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-smoke">Size {item.size}</p>
                    <p className="mt-auto text-sm font-semibold text-white">{formatMAD(item.unitCents * item.quantity)}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Discount */}
            <div className="mt-5 border-t border-charcoal-border pt-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-smoke-dark" />
                  <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Discount code" className="input pl-9 uppercase" />
                </div>
                <button type="button" onClick={() => applyCode()} disabled={applying} className="btn-secondary px-5">
                  {applying ? '…' : 'Apply'}
                </button>
              </div>
              {codeMsg && (
                <p className={`mt-2 flex items-center gap-1 text-xs ${discount ? 'text-electric-300' : 'text-rose-400'}`}>
                  {discount && <Check size={13} />} {codeMsg}
                </p>
              )}
            </div>

            <div className="mt-5 space-y-2.5 border-t border-charcoal-border pt-5 text-sm">
              <SummaryRow label="Subtotal" value={formatMAD(subtotal)} />
              {discountCents > 0 && <SummaryRow label={`Discount (${discount?.code})`} value={`−${formatMAD(discountCents)}`} accent />}
              <SummaryRow label="Delivery" value="Free" accent />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-charcoal-border pt-4">
              <span className="text-sm text-smoke">Total</span>
              <span className="font-display text-2xl font-bold text-white">{formatMAD(total)}</span>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full">
              {submitting ? 'Placing order…' : `Place Order · ${formatMAD(total)}`}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-smoke-dark">
              <span className="inline-flex items-center gap-1"><Truck size={13} /> Free delivery</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck size={13} /> COD</span>
              <span className="inline-flex items-center gap-1"><Check size={13} /> 14-day returns</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-smoke">{label}</span>
      <span className={accent ? 'font-medium text-electric-300' : 'text-white'}>{value}</span>
    </div>
  );
}
