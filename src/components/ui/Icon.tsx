import {
  Truck,
  Shirt,
  ShieldCheck,
  Sparkles,
  Layers,
  Brush,
  Leaf,
  Maximize,
  Heart,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  Truck,
  Shirt,
  ShieldCheck,
  Sparkles,
  Layers,
  Brush,
  Leaf,
  Maximize,
  Heart,
};

export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Cmp = MAP[name] ?? Sparkles;
  return <Cmp size={size} className={className} strokeWidth={1.75} />;
}
