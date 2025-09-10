"use client";

import { memo, useState } from "react";
import { Check, X, Globe, Users, Camera, Briefcase, Hash, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface SocialNetwork {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  maxLength?: number;
  features?: string[];
}

const networks: SocialNetwork[] = [
  {
    id: "twitter",
    name: "Twitter/X",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "bg-black text-white",
    description: "Microblog com limite de caracteres",
    maxLength: 280,
    features: ["Hashtags", "Mentions", "Threads"]
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <Users className="h-4 w-4" />,
    color: "bg-blue-600 text-white",
    description: "Rede social para conexões pessoais",
    features: ["Stories", "Events", "Groups"]
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Camera className="h-4 w-4" />,
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    description: "Plataforma visual para fotos e vídeos",
    features: ["Stories", "Reels", "IGTV"]
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Briefcase className="h-4 w-4" />,
    color: "bg-blue-700 text-white",
    description: "Rede profissional e de negócios",
    features: ["Articles", "Professional Network", "Job Posts"]
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <Hash className="h-4 w-4" />,
    color: "bg-black text-white",
    description: "Vídeos curtos e virais",
    features: ["Short Videos", "Effects", "Sounds"]
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <Globe className="h-4 w-4" />,
    color: "bg-red-600 text-white",
    description: "Plataforma de vídeos de longa duração",
    features: ["Long Videos", "Shorts", "Live Streaming"]
  }
];

interface NetworkSelectProps {
  value: string[];
  onChange: (networks: string[]) => void;
  disabled?: boolean;
  maxSelections?: number;
}

export const NetworkSelect = memo(function NetworkSelect({ 
  value, 
  onChange, 
  disabled = false,
  maxSelections = 6
}: NetworkSelectProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedNetworks = showAll ? networks : networks.slice(0, 4);
  
  const handleNetworkToggle = (networkId: string) => {
    if (disabled) return;
    
    if (value.includes(networkId)) {
      onChange(value.filter((id) => id !== networkId));
    } else {
      if (value.length >= maxSelections) {
        return; // Não permite mais seleções
      }
      onChange([...value, networkId]);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allIds = networks.slice(0, maxSelections).map(n => n.id);
    onChange(allIds);
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  const selectedNetworks = networks.filter(n => value.includes(n.id));
  const canSelectMore = value.length < maxSelections;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Redes Sociais ({value.length}/{maxSelections})
        </Label>
        
        <div className="flex gap-2">
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              disabled={disabled}
            >
              Limpar
            </Button>
          )}
          {value.length < maxSelections && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={disabled}
            >
              Selecionar Todas
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayedNetworks.map((network) => {
          const isSelected = value.includes(network.id);
          const canSelect = canSelectMore || isSelected;
          
          return (
            <div
              key={network.id}
              className={cn(
                "relative p-4 border rounded-lg cursor-pointer transition-all",
                isSelected && "border-primary bg-primary/5",
                !canSelect && "opacity-50 cursor-not-allowed",
                canSelect && !disabled && "hover:border-primary/50",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() => canSelect && handleNetworkToggle(network.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-lg", network.color)}>
                  {network.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{network.name}</h4>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {network.description}
                  </p>
                  
                  {network.maxLength && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Máx: {network.maxLength} caracteres
                    </p>
                  )}
                  
                  {network.features && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {network.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <Checkbox
                  checked={isSelected}
                  disabled={!canSelect || disabled}
                  className="mt-1"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {networks.length > 4 && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          disabled={disabled}
        >
          {showAll ? 'Mostrar Menos' : `Mostrar Mais (${networks.length - 4})`}
        </Button>
      )}

      {selectedNetworks.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Selecionadas:</Label>
          <div className="flex flex-wrap gap-2">
            {selectedNetworks.map((network) => (
              <Badge
                key={network.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {network.icon}
                {network.name}
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNetworkToggle(network.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {!canSelectMore && (
        <p className="text-xs text-muted-foreground">
          Máximo de {maxSelections} redes selecionadas
        </p>
      )}
    </div>
  );
});
