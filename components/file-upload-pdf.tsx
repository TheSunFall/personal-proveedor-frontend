"use client";

import { File, FileText, X } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FileUploadPdfProps {
  onFileChange?: (file: File | null) => void;
}

export function FileUploadPdf({ onFileChange }: FileUploadPdfProps) {
  const [uploadState, setUploadState] = useState<{
    file: File | null;
    progress: number;
    uploading: boolean;
  }>({
    file: null,
    progress: 0,
    uploading: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (file.type === "application/pdf") {
      setUploadState({ file, progress: 0, uploading: true });

      const interval = setInterval(() => {
        setUploadState((prev) => {
          const newProgress = prev.progress + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            // Ejecutar callback después de actualizar el estado
            setTimeout(() => onFileChange?.(file), 0);
            return { ...prev, progress: 100, uploading: false };
          }
          return { ...prev, progress: newProgress };
        });
      }, 200);
    } else {
      toast.error("Por favor sube un archivo PDF.", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    setUploadState({ file: null, progress: 0, uploading: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileChange?.(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const { file, progress, uploading } = uploadState;

  return (
    <div className="w-full">
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <div
          className="flex justify-center rounded-md border border-dashed border-input px-6 py-9"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <File
              className="mx-auto h-12 w-12 text-muted-foreground"
              aria-hidden={true}
            />
            <div className="flex flex-col text-sm leading-6 text-muted-foreground mt-2">
              <p>Arrastra y suelta o</p>
              <label
                htmlFor="file-upload-pdf"
                className="relative cursor-pointer font-medium text-primary-text hover:underline hover:underline-offset-4"
              >
                <span>selecciona archivo</span>
                <input
                  id="file-upload-pdf"
                  name="file-upload-pdf"
                  type="file"
                  className="sr-only"
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>
        </div>

        <p className="text-xs leading-5 text-muted-foreground">
          Archivos aceptados: PDF solamente. Máximo: 10MB
        </p>

        {file && (
          <Card className="relative mt-4 bg-muted p-4 gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Eliminar"
              onClick={resetFile}
            >
              <X className="h-5 w-5 shrink-0" aria-hidden={true} />
            </Button>

            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                <FileText
                  className="h-5 w-5 text-red-500"
                  aria-hidden={true}
                />
              </span>
              <div>
                <p className="text-xs font-medium text-foreground">
                  {file?.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {file && formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Progress value={progress} className="h-1.5" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
}
