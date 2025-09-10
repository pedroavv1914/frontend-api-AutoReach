"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Video, File, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MediaFile {
  file: File;
  preview?: string;
  id: string;
  uploadProgress?: number;
  error?: string | null;
}

interface MediaUploaderProps {
  onUpload?: (files: File[]) => void;
  value?: string[];
  onChange?: (files: string[]) => void;
  maxFiles?: number;
  maxFileSize?: number; // em MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

const DEFAULT_ACCEPTED_TYPES = ['image/*', 'video/*'];
const DEFAULT_MAX_FILE_SIZE = 10; // 10MB
const DEFAULT_MAX_FILES = 4;

export function MediaUploader({ 
  onUpload, 
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false
}: MediaUploaderProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Verificar tamanho
    if (file.size > maxFileSize * 1024 * 1024) {
      return `Arquivo muito grande. Máximo ${maxFileSize}MB`;
    }

    // Verificar tipo
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return 'Tipo de arquivo não suportado';
    }

    return null;
  }, [maxFileSize, acceptedTypes]);

  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const simulateUpload = useCallback(async (filesToUpload: MediaFile[]) => {
    setIsUploading(true);

    for (const mediaFile of filesToUpload) {
      // Simular progresso de upload
      for (let progress = 0; progress <= 100; progress += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setMediaFiles(prev => 
          prev.map(mf => 
            mf.id === mediaFile.id 
              ? { ...mf, uploadProgress: progress }
              : mf
          )
        );
      }
    }

    setIsUploading(false);
    onUpload?.(filesToUpload.map(mf => mf.file));
  }, [onUpload]);

  const processFiles = useCallback(async (files: File[]) => {
    if (mediaFiles.length + files.length > maxFiles) {
      alert(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    const newMediaFiles: MediaFile[] = [];

    for (const file of files) {
      const error = validateFile(file);
      const preview = await generatePreview(file);
      
      newMediaFiles.push({
        file,
        preview,
        id: Math.random().toString(36).substr(2, 9),
        error,
        uploadProgress: error ? undefined : 0
      });
    }

    setMediaFiles(prev => [...prev, ...newMediaFiles]);

    // Simular upload para arquivos válidos
    const validFiles = newMediaFiles.filter(mf => !mf.error);
    if (validFiles.length > 0) {
      simulateUpload(validFiles);
    }
  }, [mediaFiles.length, maxFiles, simulateUpload, validateFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (id: string) => {
    setMediaFiles(prev => prev.filter(mf => mf.id !== id));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Mídia ({mediaFiles.length}/{maxFiles})
        </Label>
        
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            isDragOver && "border-primary bg-primary/5",
            disabled && "opacity-50 cursor-not-allowed",
            !disabled && "cursor-pointer hover:border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <Input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Clique para enviar</span> ou arraste arquivos aqui
            </div>
            <div className="text-xs text-muted-foreground">
              Máximo {maxFiles} arquivos, {maxFileSize}MB cada
            </div>
          </div>
        </div>
      </div>

      {mediaFiles.length > 0 && (
        <div className="space-y-3">
          {mediaFiles.map((mediaFile) => (
            <div key={mediaFile.id} className="flex items-center gap-3 p-3 border rounded-lg">
              {mediaFile.preview ? (
                <Image
                  src={mediaFile.preview}
                  alt="Preview"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  {getFileIcon(mediaFile.file)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {mediaFile.file.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFileSize(mediaFile.file.size)}
                </div>
                
                {mediaFile.error && (
                  <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {mediaFile.error}
                  </div>
                )}
                
                {mediaFile.uploadProgress !== undefined && !mediaFile.error && (
                  <div className="mt-2">
                    <Progress value={mediaFile.uploadProgress} className="h-1" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {mediaFile.uploadProgress === 100 ? 'Concluído' : `${mediaFile.uploadProgress}%`}
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(mediaFile.id)}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Enviando arquivos...
        </div>
      )}
    </div>
  );
}
