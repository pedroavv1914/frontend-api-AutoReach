"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function MediaUploader({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      // Placeholder: simula upload e gera object URLs
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      setPreviews((p) => [...p, ...urls]);
      onUploaded(urls);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? "Enviando..." : "Selecionar arquivos"}
      </Button>
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative w-full aspect-video bg-black/5 rounded overflow-hidden">
              {/* Usa Image para imagens; para vídeo seria <video> (omito pela simplicidade) */}
              <Image src={src} alt="preview" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
