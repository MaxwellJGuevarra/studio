'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardView } from '@/components/dashboard-view';
import { EntitiesView } from '@/components/entities-view';
import { MaskedDataView } from '@/components/masked-data-view';
import { Button } from "@/components/ui/button";
import type { ProcessingResult } from "@/lib/types";

interface ResultsDisplayProps {
  results: ProcessingResult;
  onReset: () => void;
}

export function ResultsDisplay({ results, onReset }: ResultsDisplayProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="entities">Detected Entities</TabsTrigger>
            <TabsTrigger value="masked">Masked Data</TabsTrigger>
          </TabsList>
          <Button onClick={onReset} variant="outline">Scan Another File</Button>
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
