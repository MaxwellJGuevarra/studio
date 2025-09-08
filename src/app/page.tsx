'use client';

import { useState } from 'react';
import { ShieldCheck, Terminal } from 'lucide-react';
import { FileUploader } from '@/components/file-uploader';
import { ResultsDisplay } from '@/components/results-display';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { processCsvFile } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { ProcessingResult } from '@/lib/types';


function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-2xl font-bold tracking-tight text-foreground">
              PII Sentinel
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}

function WelcomeMessage() {
  return (
    <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Welcome to PII Sentinel
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Your intelligent agent for automated PII detection and masking.
        </p>
    </div>
  )
}


export default function Home() {
  const [results, setResults] = useState<ProcessingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileProcess = async (file: File, fileContent: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const resultData = await processCsvFile(fileContent);
      setResults(resultData);
      if (resultData.nerResults.length === 0) {
        toast({
          title: "Scan Complete",
          description: "No personally identifiable information was found.",
        });
      } else {
        toast({
          title: "Scan Complete",
          description: `Found ${resultData.nerResults.length} PII entities.`,
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was an error during analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-8">
            {!results && !isLoading && <WelcomeMessage />}

            {isLoading ? (
                <LoadingSpinner />
            ) : error ? (
                <Alert variant="destructive" className="max-w-2xl">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Processing Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : results ? (
                <ResultsDisplay results={results} onReset={handleReset} />
            ) : (
                <FileUploader onFileProcess={handleFileProcess} disabled={isLoading} />
            )}
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        Built with Next.js and Genkit.
      </footer>
    </div>
  );
}
