'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Ruler } from 'lucide-react';

// Measurements in cm for the NOVYR oversized fit
const TABLE = [
  { size: 'XS', chest: 54, length: 68, shoulder: 52 },
  { size: 'S', chest: 56, length: 70, shoulder: 54 },
  { size: 'M', chest: 58, length: 72, shoulder: 56 },
  { size: 'L', chest: 60, length: 74, shoulder: 58 },
  { size: 'XL', chest: 62, length: 76, shoulder: 60 },
  { size: 'XXL', chest: 64, length: 78, shoulder: 62 },
];

export function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-smoke-light underline-offset-4 hover:text-white hover:underline"
      >
        <Ruler size={14} /> Size guide
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-charcoal-border bg-ink-800 p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-white">Size Guide</h3>
                <button onClick={() => setOpen(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full text-smoke hover:bg-white/5 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <p className="mt-1 text-xs text-smoke">Oversized fit · measurements in cm. For a less oversized look, size down.</p>

              <div className="mt-5 overflow-hidden rounded-xl border border-charcoal-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink-900 text-xs uppercase tracking-wider text-smoke">
                      <th className="px-4 py-3 text-left font-medium">Size</th>
                      <th className="px-4 py-3 text-left font-medium">Chest</th>
                      <th className="px-4 py-3 text-left font-medium">Length</th>
                      <th className="px-4 py-3 text-left font-medium">Shoulder</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-charcoal-border">
                    {TABLE.map((row) => (
                      <tr key={row.size} className="text-smoke-light">
                        <td className="px-4 py-3 font-semibold text-white">{row.size}</td>
                        <td className="px-4 py-3">{row.chest}</td>
                        <td className="px-4 py-3">{row.length}</td>
                        <td className="px-4 py-3">{row.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
