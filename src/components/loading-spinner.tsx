import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function LoadingSpinner() {
  return (
    <Card className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center text-center p-0">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
            <h2 className="text-2xl font-semibold text-foreground">Analyzing Data...</h2>
            <p className="mt-2 text-muted-foreground">
                Our AI is scanning for sensitive information. This may take a moment.
            </p>
        </CardContent>
    </Card>
  );
}
