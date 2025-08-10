"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";

export function SchedulePicker({ value, onChange }: { value?: Date; onChange: (d?: Date) => void }) {
  const formatted = useMemo(() => {
    if (!value) return "";
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const dd = String(value.getDate()).padStart(2, "0");
    const hh = String(value.getHours()).padStart(2, "0");
    const mi = String(value.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (!v) return onChange(undefined);
    const d = new Date(v);
    if (isNaN(d.getTime())) return;
    onChange(d);
  }

  return (
    <div className="space-y-1">
      <label className="text-sm">Data/hora (opcional)</label>
      <Input type="datetime-local" value={formatted} onChange={handleChange} />
      <p className="text-xs opacity-70">Deixe vazio para publicar agora.</p>
    </div>
  );
}
