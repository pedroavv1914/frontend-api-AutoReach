"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SchedulePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
}

export function SchedulePicker({ value, onChange, disabled = false }: SchedulePickerProps) {
  const [error, setError] = useState<string | null>(null);

  const formatted = useMemo(() => {
    if (!value) return "";
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const dd = String(value.getDate()).padStart(2, "0");
    const hh = String(value.getHours()).padStart(2, "0");
    const mi = String(value.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }, [value]);

  const displayValue = value
    ? format(value, "PPP 'às' HH:mm", { locale: ptBR })
    : "Não agendado";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setError(null);
    
    if (!v) {
      onChange(undefined);
      return;
    }
    
    const d = new Date(v);
    
    if (isNaN(d.getTime())) {
      setError("Data inválida");
      return;
    }
    
    // Validar se a data é no futuro (pelo menos 5 minutos)
    const now = new Date();
    const minFutureTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutos no futuro
    
    if (d <= minFutureTime) {
      setError("A data deve ser pelo menos 5 minutos no futuro");
      return;
    }
    
    // Validar se não é muito longe no futuro (1 ano)
    const maxFutureTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    if (d > maxFutureTime) {
      setError("A data não pode ser mais de 1 ano no futuro");
      return;
    }
    
    onChange(d);
  }

  const handleQuickSchedule = (minutes: number) => {
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + minutes * 60 * 1000);
    onChange(scheduledTime);
    setError(null);
  };

  const handleClear = () => {
    onChange(undefined);
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Agendamento
        </Label>
        
        <Input
          type="datetime-local"
          value={formatted}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            "w-full",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
          min={new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 16)}
        />
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        {value && !error && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Agendado para: {displayValue}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Atalhos rápidos:</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickSchedule(30)}
            disabled={disabled}
          >
            +30min
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickSchedule(60)}
            disabled={disabled}
          >
            +1h
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              tomorrow.setHours(9, 0, 0, 0);
              onChange(tomorrow);
              setError(null);
            }}
            disabled={disabled}
          >
            Amanhã 9h
          </Button>
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        {value ? "Post será publicado automaticamente na data agendada" : "Deixe vazio para publicar imediatamente"}
      </p>
    </div>
  );
}
