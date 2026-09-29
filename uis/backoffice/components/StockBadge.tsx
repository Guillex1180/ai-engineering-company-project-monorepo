import {
  STOCK_LEVEL_BADGE,
  STOCK_LEVEL_ICON,
  STOCK_LEVEL_LABELS,
  stockLevel
} from "@/lib/inventory-labels";

/**
 * Indicador de nivel de stock. No depende solo del color: incluye icono y texto.
 */
export default function StockBadge({ stock }: { stock: number }) {
  const level = stockLevel(stock);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STOCK_LEVEL_BADGE[level]}`}
    >
      <span aria-hidden="true">{STOCK_LEVEL_ICON[level]}</span>
      {STOCK_LEVEL_LABELS[level]}
    </span>
  );
}
