'use client';

import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardView } from '@/components/dashboard-view';
import { EntitiesView } from '@/components/entities-view';
import { MaskedDataView } from '@/components/masked-data-view';
import { Button } from "@/components/ui/button";
import { ExportControls } from '@/components/export-controls';
import type { ProcessingResult } from "@/lib/types";

interface ResultsDisplayProps {
  results: ProcessingResult;
  onReset: () => void;
}

export function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {

  const maskedData = useMemo(() => {
    let text = results.originalData;
    const sortedEntities = [...results.nerResults].sort((a, b) => b.start - a.start);
    
    for (const entity of sortedEntities) {
      const mask = '*'.repeat(entity.text.length);
      text = text.substring(0, entity.start) + mask + text.substring(entity.end);
    }
    return text;
  }, [results.originalData, results.nerResults]);


  return (
    <div className="w-full">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="entities">Detected Entities</TabsTrigger>
            <TabsTrigger value="masked">Masked Data</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <ExportControls maskedData={maskedData} />
            <Button onClick={onReset} variant="outline">Scan Another File</Button>
          </div>
        </div>
        <TabsContent value="dashboard">
          <DashboardView report={results.summaryReport} entities={results.nerResults} />
        </TabsContent>
        <TabsContent value="entities">
          <EntitiesView entities={results.nerResults} maskingRules={results.maskingRules} />
        </TabsContent>
        <TabsContent value="masked">
          <MaskedDataView originalData={results.originalData} entities={results.nerResults} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
