import type { Store } from "@/lib/mock-data";

export function StoreBadge({ store, size = "md" }: { store: Store; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "h-7 w-7 text-[10px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-9 w-9 text-xs";
  return (
    <div className="flex items-center gap-2">
      <div className={`grid place-items-center rounded-md bg-gradient-to-br ${store.color} font-bold text-white shadow ${sz}`}>
        {store.short}
      </div>
      <span className="text-sm font-medium">{store.name}</span>
    </div>
  );
}
