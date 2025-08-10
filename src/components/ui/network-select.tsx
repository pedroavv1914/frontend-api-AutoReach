"use client";

import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type Network = "twitter" | "linkedin" | "instagram";

const OPTIONS: { value: Network; label: string }[] = [
  { value: "twitter", label: "Twitter/X" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
];

export function NetworkSelect({ value, onChange }: { value: Network[]; onChange: (v: Network[]) => void }) {
  const selectedLabel = useMemo(() => {
    if (!value?.length) return "Selecione redes";
    return `${value.length} rede(s) selecionada(s)`;
  }, [value]);

  // Simples seletor cumulativo: cada seleção adiciona, repetir remove
  function handleSelect(v: Network) {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...(value as Network[]), v]);
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Select onValueChange={(v) => handleSelect(v as Network)}>
        <SelectTrigger className="w-[240px]"><SelectValue placeholder={selectedLabel} /></SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="text-xs opacity-70">{selectedLabel}</div>
    </div>
  );
}
