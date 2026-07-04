'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FileSpreadsheet } from 'lucide-react';

export type ExportOrderRow = {
  orderId: string;
  date: string;
  customer: string;
  phone: string;
  products: string;
  qty: number;
  total: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
};

/** Downloads the currently filtered orders as .xlsx (columns mirror the table). */
export function ExportOrdersButton({ rows }: { rows: ExportOrderRow[] }) {
  const [busy, setBusy] = useState(false);

  async function exportXlsx() {
    if (!rows.length) {
      toast.error('Nothing to export in this view');
      return;
    }
    setBusy(true);
    try {
      const XLSX = await import('xlsx');
      const sheetRows = rows.map((r) => ({
        'Order ID': r.orderId,
        Date: r.date,
        Customer: r.customer,
        Phone: r.phone,
        Products: r.products,
        Qty: r.qty,
        Total: r.total,
        'Payment Method': r.paymentMethod,
        'Payment Status': r.paymentStatus,
        'Order Status': r.orderStatus,
      }));
      const ws = XLSX.utils.json_to_sheet(sheetRows);
      ws['!cols'] = [
        { wch: 12 }, { wch: 12 }, { wch: 22 }, { wch: 14 }, { wch: 44 },
        { wch: 6 }, { wch: 10 }, { wch: 16 }, { wch: 14 }, { wch: 12 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Orders');
      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `novyr-orders-${stamp}.xlsx`);
      toast.success(`Exported ${rows.length} order${rows.length === 1 ? '' : 's'}`);
    } catch {
      toast.error('Export failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={exportXlsx}
      disabled={busy}
      className="flex items-center gap-2 rounded-lg border border-charcoal-border bg-ink-800 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:border-electric disabled:opacity-50"
    >
      <FileSpreadsheet size={15} className="text-electric" />
      {busy ? 'Exporting…' : 'Export to Excel'}
    </button>
  );
}
