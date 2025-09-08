'use client';
import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileProcess: (file: File, fileContent: string) => void;
  disabled: boolean;
}

export function FileUploader({ onFileProcess, disabled }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files[0].type === 'text/csv') {
        setFile(e.dataTransfer.files[0]);
      } else {
        console.error("Invalid file type. Please upload a CSV file.");
      }
    }
  };

  const handleProcessClick = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileProcess(file, text);
      };
      reader.readAsText(file);
    }
  };
  
  const removeFile = () => {
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold">Upload Your Data</CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-center">
        {!file ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
              isDragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <UploadCloud className="h-16 w-16 text-muted-foreground" strokeWidth={1} />
            <p className="mt-4 text-lg font-semibold text-foreground">
              Drop a CSV file here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Your data will be processed to identify and mask PII.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-3">
                  <FileText className="h-10 w-10 text-primary" />
                  <span className="font-medium">{file.name}</span>
                  <Button variant="ghost" size="icon" onClick={removeFile} aria-label="Remove file">
                      <X className="h-5 w-5"/>
                  </Button>
              </div>
          </div>
        )}
        <Button onClick={handleProcessClick} disabled={!file || disabled} size="lg" className="mt-6 w-full">
          {disabled ? 'Scanning...' : 'Scan for PII'}
        </Button>
      </CardContent>
    </Card>
  );
}
