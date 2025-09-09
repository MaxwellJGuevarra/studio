'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportControlsProps {
  maskedData: string;
}

export function ExportControls({ maskedData }: ExportControlsProps) {
  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const jsonOutput = {
      maskedData: maskedData,
    };
    downloadFile(JSON.stringify(jsonOutput, null, 2), 'masked_data.json', 'application/json');
  };

  const handleExportCsv = () => {
    downloadFile(maskedData, 'masked_data.csv', 'text/csv;charset=utf-8;');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Masked Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportJson}>As JSON</DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCsv}>As CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
